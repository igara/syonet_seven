import { toolsChatStyle } from "@www/styles";

interface CanvasElement extends HTMLCanvasElement {
  captureStream(msec?: number): MediaStream;
}
let peerConnections: {
  [uuid: string]: RTCPeerConnection;
} = {};
let selfVideoStream: {
  now: MediaStream | null;
  old: MediaStream[];
} = {
  now: null,
  old: [],
};
let ws: WebSocket;
let chatID: string;
let trackSender: RTCRtpSender | null;
let userAgent: string;
let clientUUID: string;

const rtcConfig = {
  iceServers: [{ urls: "turn:syonet.work:3478", credential: "chat", username: "syonet" }],
};

const isMCU = () => {
  return userAgent === "WebRTC MCU Chat";
};

// Videoの再生を開始する
export const playVideo = (element: HTMLVideoElement, stream: MediaStream) => {
  element.srcObject = stream;
  element.controls = true;
  element.autoplay = true;
  element.muted = true;
};

const getWSUrl = (chatID: string) => {
  if (process.env.WWW_DOMAIN === "syonet.work") return `wss://${process.env.WWW_DOMAIN}/chat/${chatID}`;

  return `ws://${process.env.WWW_DOMAIN}:9001/chat/${chatID}`;
};

const updateMCUVideo = () => {
  const mcuCanvas = document.getElementById("mcuCanvas") as CanvasElement;
  if (!mcuCanvas) return;
  const mcuVideo = document.getElementById("mcuVideo") as HTMLVideoElement;
  if (!mcuVideo) return;
  const remoteVideoArea = document.getElementById("remoteVideoArea");
  if (!remoteVideoArea) return;
  const canvas = document.getElementById("mcuCanvas") as CanvasElement;
  if (!canvas) return;

  canvas.width = 320;
  canvas.height = 320 * remoteVideoArea.childNodes.length;
  const context = canvas.getContext("2d");
  if (!context) return;

  const captureStream = mcuCanvas.captureStream();
  const audioContext = new AudioContext();
  const biquadFilter = audioContext.createBiquadFilter();
  biquadFilter.type = "highshelf";
  biquadFilter.frequency.value = 1000;
  biquadFilter.gain.value = -50;
  const mixedOutput = audioContext.createMediaStreamDestination();
  remoteVideoArea.childNodes.forEach((element, index) => {
    const videoElement = element as HTMLVideoElement;

    const d = 320 / videoElement.videoWidth;
    context.drawImage(videoElement, 0, 320 * index, 320, videoElement.videoHeight * d);

    const srcObject = videoElement.srcObject as MediaStream;
    const audioTracks = srcObject.getTracks().filter(track => {
      return track.kind === "audio";
    });

    if (audioTracks.length !== 0) {
      const microphone = audioContext.createMediaStreamSource(srcObject);
      microphone.connect(biquadFilter);
      biquadFilter.connect(mixedOutput);
    }
  });
  captureStream.addTrack(mixedOutput.stream.getTracks()[0]);

  playVideo(mcuVideo, captureStream);
};

export const connectChat = (id: string) => {
  chatID = id;
  const wsUrl = getWSUrl(chatID);
  ws = new WebSocket(wsUrl);
  userAgent = window.navigator.userAgent;

  ws.onopen = async () => {
    ws.send(
      JSON.stringify({
        type: "create",
        chatID,
        userAgent,
      }),
    );
    setInterval(() => {
      ws.send(
        JSON.stringify({
          type: "ping",
          chatID,
          userAgent,
        }),
      );
    }, 60000);
  };
  ws.onerror = err => {
    console.error(err);
  };
  ws.onmessage = async evt => {
    const message = JSON.parse(evt.data);
    if (message.type)
      switch (message.type) {
        case "create": {
          console.info("create");

          if (!isMCU()) {
            clientUUID = message.clientUUID;
            ws.send(
              JSON.stringify({
                type: "create_mcu_peer_connection",
                chatID,
                clientUUID: clientUUID,
                userAgent,
              }),
            );
          } else {
            setInterval(() => {
              updateMCUVideo();
            }, 1000 / 30);
          }

          break;
        }
        case "create_mcu_peer_connection": {
          console.info("create_mcu_peer_connection");
          await createPeerConnection(message.clientUUID);

          ws.send(
            JSON.stringify({
              type: "create_client_peer_connection",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
            }),
          );
          break;
        }
        case "create_client_peer_connection": {
          console.info("create_client_peer_connection");
          await createPeerConnection(message.mcuUUID);

          ws.send(
            JSON.stringify({
              type: "mcu_local_offer",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
            }),
          );
          break;
        }
        case "mcu_local_offer": {
          console.info("mcu_local_offer");

          const peerConnection = peerConnections[message.clientUUID];
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          ws.send(
            JSON.stringify({
              type: "mcu_remote_offer",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
              sessionDescription: peerConnection.localDescription,
            }),
          );
          break;
        }
        case "mcu_remote_offer": {
          console.info("mcu_remote_offer");
          const peerConnection = peerConnections[message.mcuUUID];
          await setRemoteDescription(message.sessionDescription, peerConnection);

          ws.send(
            JSON.stringify({
              type: "mcu_local_answer",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
            }),
          );
          break;
        }
        case "mcu_local_answer": {
          console.info("mcu_local_answer");
          const uuid = isMCU() ? message.clientUUID : message.mcuUUID;
          const peerConnection = peerConnections[uuid];
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          ws.send(
            JSON.stringify({
              type: "mcu_remote_answer",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
              sessionDescription: peerConnection.localDescription,
            }),
          );
          break;
        }
        case "mcu_remote_answer": {
          console.info("mcu_remote_answer");
          const uuid = isMCU() ? message.clientUUID : message.mcuUUID;
          const peerConnection = peerConnections[uuid];
          await setRemoteDescription(message.sessionDescription, peerConnection);

          ws.send(
            JSON.stringify({
              type: "client_local_offer",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
            }),
          );
          break;
        }

        case "client_local_offer": {
          console.info("client_local_offer");
          const peerConnection = peerConnections[message.mcuUUID];
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          ws.send(
            JSON.stringify({
              type: "client_remote_offer",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
              sessionDescription: peerConnection.localDescription,
            }),
          );
          break;
        }
        case "client_remote_offer": {
          console.info("client_remote_offer");
          const peerConnection = peerConnections[message.clientUUID];
          await setRemoteDescription(message.sessionDescription, peerConnection);

          ws.send(
            JSON.stringify({
              type: "client_local_answer",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
            }),
          );
          break;
        }
        case "client_local_answer": {
          console.info("client_local_answer");
          const uuid = isMCU() ? message.clientUUID : message.mcuUUID;
          const peerConnection = peerConnections[uuid];
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          ws.send(
            JSON.stringify({
              type: "client_remote_answer",
              chatID,
              clientUUID: message.clientUUID,
              mcuUUID: message.mcuUUID,
              userAgent,
              sessionDescription: peerConnection.localDescription,
            }),
          );
          break;
        }
        case "client_remote_answer": {
          console.info("client_remote_answer");
          const uuid = isMCU() ? message.clientUUID : message.mcuUUID;
          const peerConnection = peerConnections[uuid];
          await setRemoteDescription(message.sessionDescription, peerConnection);
          break;
        }

        case "delete": {
          console.info("delete");
          const videoId = `video-${message.mediaStreamId}`;
          const videoElement: HTMLVideoElement = document.getElementById(videoId) as HTMLVideoElement;
          if (videoElement) {
            videoElement.remove();
          }
          break;
        }
        case "candidate": {
          console.info("candidate");
          const uuid = isMCU() ? message.clientUUID : message.mcuUUID;
          const peerConnection = peerConnections[uuid];
          if (!peerConnection) break;
          const candidate = new RTCIceCandidate(message.ice);
          await peerConnection.addIceCandidate(candidate);
          break;
        }
        case "close": {
          const uuid = isMCU() ? message.clientUUID : message.mcuUUID;
          const peerConnection = peerConnections[uuid];
          if (!peerConnection) break;
          hangUp(peerConnection);
          break;
        }
      }
  };

  ws.onclose = () => {
    console.info("close chat");
  };
  return ws;
};

// ICE candidate生成時に送信する
const sendIceCandidate = (candidate: RTCIceCandidate) => {
  const message = JSON.stringify({
    type: "candidate",
    ice: candidate,
    chatID,
    userAgent,
  });
  ws.send(message);
};

// WebRTCを利用する準備をする
const prepareNewConnection = (peerConnection: RTCPeerConnection) => {
  // リモートのMediStreamTrackを受信した時
  peerConnection.ontrack = async evt => {
    console.info("ontrack");
    const remoteVideoArea = document.getElementById("remoteVideoArea");
    if (!remoteVideoArea) return;

    if (isMCU()) {
      console.info("ontarack mcu");
      evt.streams.forEach(async stream => {
        const videoId = `video-${stream.id}`;
        let videoElement: HTMLVideoElement = document.getElementById(videoId) as HTMLVideoElement;
        if (!videoElement) {
          videoElement = document.createElement("video");
          videoElement.setAttribute("id", videoId);
          videoElement.controls = true;
          videoElement.autoplay = true;
          videoElement.muted = true;
          videoElement.setAttribute("class", toolsChatStyle.video);
          remoteVideoArea.appendChild(videoElement);
        }
        playVideo(videoElement, stream);
      });
      updateMCUVideo();

      const mcuVideo = document.getElementById("mcuVideo") as HTMLVideoElement;
      if (!mcuVideo) return;
      const mediaStream = mcuVideo.srcObject as MediaStream;
      if (!mediaStream) return;
      console.warn("mediaStream");
      console.info(mediaStream);
      console.info(mediaStream.getTracks());

      for (const key in peerConnections) {
        const peer = peerConnections[key];
        if (!peer) break;

        for (const track of mediaStream.getTracks()) {
          try {
            console.info("addtrack mcu");
            peer.addTrack(track, mediaStream);
          } catch (error) {
            console.warn(error);
          }
        }
      }
    } else {
      console.info("client ontrack");
      evt.streams.forEach(async stream => {
        const videoElement = document.getElementById("clientVideo") as HTMLVideoElement;
        videoElement.srcObject = stream;
      });
    }
  };

  // ICE Candidateを収集したときのイベント
  peerConnection.onicecandidate = evt => {
    console.info("onicecandidate");
    if (evt.candidate) {
      sendIceCandidate(evt.candidate);
    }
  };

  // Offer側でネゴシエーションが必要になったときの処理
  peerConnection.onnegotiationneeded = async () => {
    console.info("onnegotiationneeded");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  };

  // ICEのステータスが変更になったときの処理
  peerConnection.oniceconnectionstatechange = () => {
    console.info("oniceconnectionstatechange");
    switch (peerConnection.iceConnectionState) {
      case "closed":
        break;
      case "failed":
        if (peerConnection) {
          hangUp(peerConnection);
        }
        break;
      case "disconnected":
        break;
    }
  };

  return peerConnection;
};

const createPeerConnection = async (targetUUID: string) => {
  let peerConnection = peerConnections[targetUUID];
  if (!peerConnection) {
    peerConnection = prepareNewConnection(new RTCPeerConnection(rtcConfig));
    peerConnections[targetUUID] = peerConnection;
  } else {
    console.warn("peer already exist.");
  }
};

const streamUpdate = (peerConnection: RTCPeerConnection) => {
  console.info("streamUpdate");
  try {
    for (const oldVideoStream of selfVideoStream.old) {
      ws.send(
        JSON.stringify({
          type: "delete",
          mediaStreamId: oldVideoStream.id,
          chatID,
        }),
      );
    }

    const remoteVideoArea = document.getElementById("remoteVideoArea");
    if (remoteVideoArea) {
      remoteVideoArea.childNodes.forEach(element => {
        const video = element as HTMLMediaElement;
        const mediaStream = video.srcObject as MediaStream;
        if (mediaStream.active) return;
        video.remove();
      });
    }

    if (trackSender) peerConnection.removeTrack(trackSender);
    trackSender = null;

    if (selfVideoStream.now) {
      for (const track of selfVideoStream.now.getTracks()) {
        trackSender = peerConnection.addTrack(track, selfVideoStream.now);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const changeSelfVideoStream = async (
  oldSelfVideoStream: MediaStream | null,
  newSelfVideoStream: MediaStream,
) => {
  if (oldSelfVideoStream && !selfVideoStream.old.includes(oldSelfVideoStream))
    selfVideoStream.old.push(oldSelfVideoStream);
  selfVideoStream.now = newSelfVideoStream;

  if (!isMCU()) {
    ws.send(
      JSON.stringify({
        type: "create_mcu_peer_connection",
        chatID,
        clientUUID: clientUUID,
        userAgent,
      }),
    );
    setInterval(() => {
      ws.send(
        JSON.stringify({
          type: "create_mcu_peer_connection",
          chatID,
          clientUUID: clientUUID,
          userAgent,
        }),
      );
    }, 10000);
  }

  for (const key in peerConnections) {
    const peerConnection = peerConnections[key];
    if (peerConnection) streamUpdate(peerConnection);
  }
};

// P2P通信を切断する
const hangUp = (peerConnection: RTCPeerConnection) => {
  console.info("hangUp");
  if (peerConnection) {
    if (peerConnection.iceConnectionState !== "closed") {
      peerConnection.close();
      const message = JSON.stringify({ type: "close", chatID });
      ws.send(message);
      return;
    }
  }
};

const setRemoteDescription = async (sessionDescription: RTCSessionDescription, peerConnection: RTCPeerConnection) => {
  if (!peerConnection) {
    console.error("peerConnection NOT exist!");
    return;
  }
  try {
    await peerConnection.setRemoteDescription(sessionDescription);
  } catch (err) {
    console.error(err);
  }
};

export const closeSignaling = () => {
  console.info("closing chat");
  ws.close();
};
