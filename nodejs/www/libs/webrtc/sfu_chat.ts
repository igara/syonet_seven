import * as mediasoupClient from "mediasoup-client";
import socketIOClient from "socket.io-client";

let localVideoElement: HTMLVideoElement;
let remoteContainerElement: HTMLElement;
let roomNameElement: HTMLInputElement;
let localStream: MediaStream;
let clientId: string;
let device: mediasoupClient.types.Device;
let producerTransport: mediasoupClient.types.Transport;
let videoProducer: mediasoupClient.types.Producer;
let audioProducer: mediasoupClient.types.Producer;
let consumerTransport: mediasoupClient.types.Transport;
let videoConsumers: {
  [key: string]: mediasoupClient.types.Consumer;
} = {};
let audioConsumers: {
  [key: string]: mediasoupClient.types.Consumer;
} = {};

// ---- TODO ----
//  DONE - audio track
//  - multiple rooms
//    - server prepareroom, use room, cleanup, newproducer
//    - client roomID, prepareroom

// =========== socket.io ==========
let socket: SocketIOClient.Socket;

const getWSUrl = () => {
  if (process.env.WWW_DOMAIN === "syonet.work") return `https://${process.env.WWW_DOMAIN}`;

  return `http://${process.env.WWW_DOMAIN}:9003`;
};

// return Promise
const connectSocket = () => {
  if (socket) {
    socket.close();
  }

  return new Promise((resolve, reject) => {
    socket = socketIOClient(getWSUrl(), { path: "/sfu_chat" });

    socket.on("connect", async () => {
      //console.log('socket.io connected()');

      // --- prepare room ---
      const roomName = getRoomName();
      console.log("socket.io connected(). prepare room=%s", roomName);
      await sendRequest("prepare_room", { roomName });
    });
    socket.on("error", (err: any) => {
      console.error("socket.io ERROR:", err);
      reject(err);
    });
    socket.on("disconnect", (evt: any) => {
      console.log("socket.io disconnect:", evt);
    });
    socket.on("message", (message: any) => {
      console.log("socket.io message:", message);
      if (message.type === "welcome") {
        if (socket.id !== message.id) {
          console.warn("WARN: something wrong with clientID", socket.io, message.id);
        }

        clientId = message.id;
        console.log("connected to server. clientId=" + clientId);

        resolve();
      } else {
        console.error("UNKNOWN message from server:", message);
      }
    });
    socket.on("newProducer", (message: any) => {
      console.log("socket.io newProducer:", message);
      const remoteId = message.socketId;
      const prdId = message.producerId;
      const kind = message.kind;
      if (kind === "video") {
        console.log("--try consumeAdd remoteId=" + remoteId + ", prdId=" + prdId + ", kind=" + kind);
        consumeAdd(consumerTransport, remoteId, prdId, kind);
      } else if (kind === "audio") {
        //console.warn('-- audio NOT SUPPORTED YET. skip remoteId=' + remoteId + ', prdId=' + prdId + ', kind=' + kind);
        console.log("--try consumeAdd remoteId=" + remoteId + ", prdId=" + prdId + ", kind=" + kind);
        consumeAdd(consumerTransport, remoteId, prdId, kind);
      }
    });

    socket.on("producerClosed", (message: any) => {
      console.log("socket.io producerClosed:", message);
      const localId = message.localId;
      const remoteId = message.remoteId;
      const kind = message.kind;
      console.log("--try removeConsumer remoteId=%s, localId=%s, track=%s", remoteId, localId, kind);
      removeConsumer(remoteId, kind);
      removeRemoteVideo(remoteId);
    });
  });
};

const disconnectSocket = () => {
  if (socket) {
    socket.close();
    console.log("socket.io closed..");
  }
};

const isSocketConnected = () => {
  if (socket) {
    return true;
  } else {
    return false;
  }
};

const sendRequest = (type: string, data: any) => {
  return new Promise((resolve, reject) => {
    socket.emit(type, data, (err: any, response: any) => {
      if (!err) {
        // Success response, so pass the mediasoup response to the local Room.
        resolve(response);
      } else {
        reject(err);
      }
    });
  });
};

// =========== media handling ==========
const stopLocalStream = (stream: MediaStream) => {
  let tracks = stream.getTracks();
  if (!tracks) {
    console.warn("NO tracks");
    return;
  }

  tracks.forEach(track => track.stop());
};

// return Promise
const playVideo = async (element: HTMLVideoElement, stream: MediaStream) => {
  if (element.srcObject) {
    console.warn("element ALREADY playing, so ignore");
    return;
  }
  element.srcObject = stream;
  element.volume = 0;
  return await element.play();
};

const pauseVideo = (element: HTMLVideoElement) => {
  element.pause();
  element.srcObject = null;
};

const addRemoteTrack = (id: string, track: MediaStreamTrack) => {
  let video = findRemoteVideo(id);
  if (!video) {
    video = addRemoteVideo(id);
    video.controls = true;
  }

  if (video.srcObject) {
    (video.srcObject as MediaStream).addTrack(track);
    return;
  }

  const newStream = new MediaStream();
  newStream.addTrack(track);

  if (video && newStream)
    playVideo(video, newStream)
      .then(() => {
        video.volume = 1.0;
      })
      .catch(err => {
        console.error("media ERROR:", err);
      });
};

const addRemoteVideo = (id: string) => {
  let existElement = findRemoteVideo(id);
  if (existElement) {
    console.warn("remoteVideo element ALREADY exist for id=" + id);
    return existElement;
  }

  let element = document.createElement("video") as HTMLVideoElement;
  remoteContainerElement.appendChild(element);
  element.id = "remote_" + id;
  element.width = 240;
  element.height = 180;
  element.volume = 0;
  //element.controls = true;
  element.setAttribute("style", "border: solid black 1px;");
  return element;
};

const findRemoteVideo = (id: string) => {
  let element = document.getElementById("remote_" + id) as HTMLVideoElement;
  return element;
};

const removeRemoteVideo = (id: string) => {
  console.log(" ---- removeRemoteVideo() id=" + id);
  let element = document.getElementById("remote_" + id) as HTMLVideoElement;
  if (element) {
    element.pause();
    element.srcObject = null;
    remoteContainerElement.removeChild(element);
  } else {
    console.log("child element NOT FOUND");
  }
};

const removeAllRemoteVideo = () => {
  while (remoteContainerElement.firstChild) {
    const videoElement = remoteContainerElement.firstChild as HTMLVideoElement;
    videoElement.pause();
    videoElement.srcObject = null;
    remoteContainerElement.removeChild(videoElement);
  }
};

// ============ UI button ==========

const checkUseVideo = () => {
  const useVideo = (document.getElementById("use_video") as HTMLInputElement).checked;
  return useVideo;
};

const checkUseAudio = () => {
  const useAudio = (document.getElementById("use_audio") as HTMLInputElement).checked;
  return useAudio;
};

export const startMedia = () => {
  if (localStream) {
    console.warn("WARN: local media ALREADY started");
    return;
  }

  const useVideo = checkUseVideo();
  const useAudio = checkUseAudio();

  navigator.mediaDevices
    .getUserMedia({ audio: useAudio, video: useVideo })
    .then(stream => {
      localStream = stream;
      playVideo(localVideoElement, localStream);
      updateButtons();
    })
    .catch(err => {
      console.error("media ERROR:", err);
    });
};

export const stopMedia = () => {
  if (localStream) {
    pauseVideo(localVideoElement);
    stopLocalStream(localStream);
  }
  updateButtons();
};

const getRoomName = () => {
  const name = roomNameElement.value;
  if (name && name !== "") {
    return name;
  } else {
    return "_default_room";
  }
};

const getRoomFromUrl = () => {
  const search = window.location.search;
  const re = new RegExp("room=([^&=]+)");
  const results = re.exec(search);
  let room = "";
  if (results) {
    room = results[1];
  }
  return room;
};

// const isRoomSpecifiedByUrl = () => {
//   let room = getRoomFromUrl();
//   if (room && room !== "") {
//     return true;
//   } else {
//     return false;
//   }
// };

const setupRoomFromUrl = () => {
  let room = getRoomFromUrl();
  if (room && room !== "") {
    roomNameElement.value = room;
  }
};

export const connect = async () => {
  if (!localStream) {
    console.warn("WARN: local media NOT READY");
    return;
  }

  // --- connect socket.io ---
  await connectSocket().catch(err => {
    console.error(err);
    return;
  });

  updateButtons();

  // --- get capabilities --
  const data: any = await sendRequest("getRouterRtpCapabilities", {});
  console.log("getRouterRtpCapabilities:", data);
  await loadDevice(data);

  // --- get transport info ---
  console.log("--- createProducerTransport --");
  const params: any = await sendRequest("createProducerTransport", {});
  console.log("transport params:", params);
  console.log(device);
  producerTransport = device.createSendTransport(params);
  console.log("createSendTransport:", producerTransport);

  // --- join & start publish --
  producerTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
    console.log("--trasnport connect");
    sendRequest("connectProducerTransport", { dtlsParameters: dtlsParameters })
      .then(callback)
      .catch(errback);
  });

  producerTransport.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
    console.log("--trasnport produce");
    try {
      const p: any = await sendRequest("produce", {
        transportId: producerTransport.id,
        kind,
        rtpParameters,
      });
      callback({ id: p.id });
      console.log("--produce requested, then subscribe ---");
      subscribe();
    } catch (err) {
      errback(err);
    }
  });

  producerTransport.on("connectionstatechange", state => {
    switch (state) {
      case "connecting":
        console.log("publishing...");
        break;

      case "connected":
        console.log("published");
        break;

      case "failed":
        console.log("failed");
        producerTransport.close();
        break;

      default:
        break;
    }
  });

  const useVideo = checkUseVideo();
  const useAudio = checkUseAudio();
  if (useVideo) {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      const trackParams = { track: videoTrack };
      videoProducer = await producerTransport.produce(trackParams);
    }
  }
  if (useAudio) {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      const trackParams = { track: audioTrack };
      audioProducer = await producerTransport.produce(trackParams);
    }
  }

  updateButtons();
};

const subscribe = async () => {
  if (!isSocketConnected()) {
    await connectSocket().catch(err => {
      console.error(err);
      return;
    });

    // --- get capabilities --
    const data = await sendRequest("getRouterRtpCapabilities", {});
    console.log("getRouterRtpCapabilities:", data);
    await loadDevice(data);
  }

  // --- prepare transport ---
  console.log("--- createConsumerTransport --");
  if (!consumerTransport) {
    const params: any = await sendRequest("createConsumerTransport", {});
    console.log("transport params:", params);
    consumerTransport = device.createRecvTransport(params);
    console.log("createConsumerTransport:", consumerTransport);

    // --- join & start publish --
    consumerTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      console.log("--consumer trasnport connect");
      sendRequest("connectConsumerTransport", { dtlsParameters: dtlsParameters })
        .then(callback)
        .catch(errback);
    });

    consumerTransport.on("connectionstatechange", state => {
      switch (state) {
        case "connecting":
          console.log("subscribing...");
          break;

        case "connected":
          console.log("subscribed");
          //consumeCurrentProducers(clientId);
          break;

        case "failed":
          console.log("failed");
          producerTransport.close();
          break;

        default:
          break;
      }
    });

    consumeCurrentProducers(clientId);
  }
};

const consumeCurrentProducers = async (clientId: string) => {
  console.log("-- try consuleAll() --");
  const remoteInfo: any = await sendRequest("getCurrentProducers", { localId: clientId }).catch(err => {
    console.error("getCurrentProducers ERROR:", err);
    return;
  });
  //console.log('remoteInfo.producerIds:', remoteInfo.producerIds);
  console.log("remoteInfo.remoteVideoIds:", remoteInfo.remoteVideoIds);
  console.log("remoteInfo.remoteAudioIds:", remoteInfo.remoteAudioIds);
  consumeAll(consumerTransport, remoteInfo.remoteVideoIds, remoteInfo.remoteAudioIds);
};

export const disconnect = () => {
  if (localStream) {
    pauseVideo(localVideoElement);
    stopLocalStream(localStream);
  }
  if (videoProducer) {
    videoProducer.close(); // localStream will stop
  }
  if (audioProducer) {
    audioProducer.close(); // localStream will stop
  }
  if (producerTransport) {
    producerTransport.close(); // localStream will stop
  }

  for (const key in videoConsumers) {
    const consumer = videoConsumers[key];
    consumer.close();
    delete videoConsumers[key];
  }
  for (const key in audioConsumers) {
    const consumer = audioConsumers[key];
    consumer.close();
    delete audioConsumers[key];
  }

  if (consumerTransport) {
    consumerTransport.close();
  }

  removeAllRemoteVideo();

  disconnectSocket();
  updateButtons();
};

const loadDevice = async (routerRtpCapabilities: any) => {
  device = new mediasoupClient.Device();
  await device.load({ routerRtpCapabilities });
};

/*--
async function consume(transport) {
  console.log('--start of consume --');
  const { rtpCapabilities } = device;
  //const data = await socket.request('consume', { rtpCapabilities });
  const data = await sendRequest('consume', { rtpCapabilities })
    .catch(err => {
      console.error('consume ERROR:', err);
    });
  const {
    producerId,
    id,
    kind,
    rtpParameters,
  } = data;

  let codecOptions = {};
  const consumer = await transport.consume({
    id,
    producerId,
    kind,
    rtpParameters,
    codecOptions,
  });
  //const stream = new MediaStream();
  //stream.addTrack(consumer.track);

  addRemoteTrack(clientId, consumer.track);

  console.log('--end of consume');
  //return stream;
}
--*/

const consumeAll = (transport: mediasoupClient.types.Transport, remoteVideoIds: string[], remotAudioIds: string[]) => {
  console.log("----- consumeAll() -----");
  remoteVideoIds.forEach(rId => {
    consumeAdd(transport, rId, "", "video");
  });
  remotAudioIds.forEach(rId => {
    consumeAdd(transport, rId, "", "audio");
  });
};

const consumeAdd = async (
  transport: mediasoupClient.types.Transport,
  remoteSocketId: string,
  prdId: string,
  trackKind: string,
) => {
  console.log("--start of consumeAdd -- kind=%s", trackKind);
  const { rtpCapabilities } = device;
  //const data = await socket.request('consume', { rtpCapabilities });
  const data: any = await sendRequest("consumeAdd", {
    rtpCapabilities: rtpCapabilities,
    remoteId: remoteSocketId,
    kind: trackKind,
  }).catch(err => {
    console.error("consumeAdd ERROR:", err);
  });
  const { producerId, id, kind, rtpParameters } = data;
  if (prdId && prdId !== producerId) {
    console.warn("producerID NOT MATCH");
  }

  const consumer = (await transport.consume({
    id,
    producerId,
    kind,
    rtpParameters,
  })) as mediasoupClient.types.Consumer & { remoteId: string };
  //const stream = new MediaStream();
  //stream.addTrack(consumer.track);

  addRemoteTrack(remoteSocketId, consumer.track);
  addConsumer(remoteSocketId, consumer, kind);
  consumer.remoteId = remoteSocketId;
  consumer.on("transportclose", () => {
    console.log("--consumer transport closed. remoteId=" + consumer.remoteId);
    //consumer.close();
    //removeConsumer(remoteId);
    //removeRemoteVideo(consumer.remoteId);
  });
  consumer.on("producerclose", () => {
    console.log("--consumer producer closed. remoteId=" + consumer.remoteId);
    consumer.close();
    removeConsumer(remoteSocketId, kind);
    removeRemoteVideo(consumer.remoteId);
  });
  consumer.on("trackended", () => {
    console.log("--consumer trackended. remoteId=" + consumer.remoteId);
    //consumer.close();
    //removeConsumer(remoteId);
    //removeRemoteVideo(consumer.remoteId);
  });

  console.log("--end of consumeAdd");
  //return stream;

  if (kind === "video") {
    console.log("--try resumeAdd --");
    sendRequest("resumeAdd", { remoteId: remoteSocketId, kind: kind })
      .then(() => {
        console.log("resumeAdd OK");
      })
      .catch(err => {
        console.error("resumeAdd ERROR:", err);
      });
  }
};

// const getConsumer = (id: string, kind: string) => {
//   if (kind === "video") {
//     return videoConsumers[id];
//   } else if (kind === "audio") {
//     return audioConsumers[id];
//   } else {
//     console.warn("UNKNOWN consumer kind=" + kind);
//   }
// };

const addConsumer = (id: string, consumer: mediasoupClient.types.Consumer, kind: string) => {
  if (kind === "video") {
    videoConsumers[id] = consumer;
    console.log("videoConsumers count=" + Object.keys(videoConsumers).length);
  } else if (kind === "audio") {
    audioConsumers[id] = consumer;
    console.log("audioConsumers count=" + Object.keys(audioConsumers).length);
  } else {
    console.warn("UNKNOWN consumer kind=" + kind);
  }
};

const removeConsumer = (id: string, kind: string) => {
  if (kind === "video") {
    delete videoConsumers[id];
    console.log("videoConsumers count=" + Object.keys(videoConsumers).length);
  } else if (kind === "audio") {
    delete audioConsumers[id];
    console.log("audioConsumers count=" + Object.keys(audioConsumers).length);
  } else {
    console.warn("UNKNOWN consumer kind=" + kind);
  }
};

// ---- UI control ----
const updateButtons = () => {
  if (localStream) {
    disableElement("start_video_button");
    disableElement("use_video");
    disableElement("use_audio");
    if (isSocketConnected()) {
      disableElement("stop_video_button");
      disableElement("room_name");
      disableElement("connect_button");
      enabelElement("disconnect_button");
    } else {
      enabelElement("stop_video_button");
      enabelElement("room_name");
      enabelElement("connect_button");
      disableElement("disconnect_button");
    }
  } else {
    enabelElement("start_video_button");
    enabelElement("use_video");
    enabelElement("use_audio");
    disableElement("stop_video_button");
    enabelElement("room_name");
    disableElement("connect_button");
    disableElement("disconnect_button");
  }
};

const enabelElement = (id: string) => {
  let element = document.getElementById(id);
  if (element) {
    element.removeAttribute("disabled");
  }
};

const disableElement = (id: string) => {
  let element = document.getElementById(id);
  if (element) {
    element.setAttribute("disabled", "1");
  }
};

export const initializeChat = () => {
  localVideoElement = document.getElementById("local_video") as HTMLVideoElement;
  remoteContainerElement = document.getElementById("remote_container") as HTMLElement;
  roomNameElement = document.getElementById("room_name") as HTMLInputElement;
  setupRoomFromUrl();
  updateButtons();
  console.log("=== ready ===");
};
