import http from "http";
import * as mediasoup from "mediasoup";
import socketIO from "socket.io";

type SFUSocket = {
  roomName: string;
} & socketIO.Socket;

// ========= room ===========

class Room {
  name: string;
  producerTransports: {
    [id: string]: mediasoup.types.WebRtcTransport;
  };
  videoProducers: {
    [id: string]: mediasoup.types.Producer;
  };
  audioProducers: {
    [id: string]: mediasoup.types.Producer;
  };
  consumerTransports: {
    [id: string]: mediasoup.types.WebRtcTransport;
  };
  videoConsumerSets: {
    [id: string]: { [id: string]: mediasoup.types.Consumer };
  };
  audioConsumerSets: {
    [id: string]: { [id: string]: mediasoup.types.Consumer };
  };
  router: mediasoup.types.Router;

  constructor(name: string, router: mediasoup.types.Router) {
    this.name = name;
    this.router = router;
    this.producerTransports = {};
    this.videoProducers = {};
    this.audioProducers = {};

    this.consumerTransports = {};
    this.videoConsumerSets = {};
    this.audioConsumerSets = {};
  }

  getProducerTrasnport(id: string) {
    return this.producerTransports[id];
  }

  addProducerTrasport(id: string, transport: mediasoup.types.WebRtcTransport) {
    this.producerTransports[id] = transport;
    console.log("room=%s producerTransports count=%d", this.name, Object.keys(this.producerTransports).length);
  }

  removeProducerTransport(id: string) {
    delete this.producerTransports[id];
    console.log("room=%s producerTransports count=%d", this.name, Object.keys(this.producerTransports).length);
  }

  getProducer(id: string, kind: string) {
    if (kind === "video") {
      return this.videoProducers[id];
    } else if (kind === "audio") {
      return this.audioProducers[id];
    } else {
      console.warn("UNKNOWN producer kind=" + kind);
    }
  }

  getRemoteIds(clientId: string, kind: string) {
    let remoteIds = [];
    if (kind === "video") {
      for (const key in this.videoProducers) {
        if (key !== clientId) {
          remoteIds.push(key);
        }
      }
    } else if (kind === "audio") {
      for (const key in this.audioProducers) {
        if (key !== clientId) {
          remoteIds.push(key);
        }
      }
    }
    return remoteIds;
  }

  addProducer(id: string, producer: mediasoup.types.Producer, kind: string) {
    if (kind === "video") {
      this.videoProducers[id] = producer;
      console.log("room=%s videoProducers count=%d", this.name, Object.keys(this.videoProducers).length);
    } else if (kind === "audio") {
      this.audioProducers[id] = producer;
      console.log("room=%s videoProducers count=%d", this.name, Object.keys(this.audioProducers).length);
    } else {
      console.warn("UNKNOWN producer kind=" + kind);
    }
  }

  removeProducer(id: string, kind: string) {
    if (kind === "video") {
      delete this.videoProducers[id];
      console.log("videoProducers count=" + Object.keys(this.videoProducers).length);
    } else if (kind === "audio") {
      delete this.audioProducers[id];
      console.log("audioProducers count=" + Object.keys(this.audioProducers).length);
    } else {
      console.warn("UNKNOWN producer kind=" + kind);
    }
  }

  getConsumerTrasnport(id: string) {
    return this.consumerTransports[id];
  }

  addConsumerTrasport(id: string, transport: mediasoup.types.WebRtcTransport) {
    this.consumerTransports[id] = transport;
    console.log("room=%s add consumerTransports count=%d", this.name, Object.keys(this.consumerTransports).length);
  }

  removeConsumerTransport(id: string) {
    delete this.consumerTransports[id];
    console.log("room=%s remove consumerTransports count=%d", this.name, Object.keys(this.consumerTransports).length);
  }

  getConsumerSet(localId: string, kind: string) {
    if (kind === "video") {
      return this.videoConsumerSets[localId];
    } else if (kind === "audio") {
      return this.audioConsumerSets[localId];
    } else {
      console.warn("WARN: getConsumerSet() UNKNWON kind=%s", kind);
    }
  }

  addConsumerSet(localId: string, set: {}, kind: string) {
    if (kind === "video") {
      this.videoConsumerSets[localId] = set;
    } else if (kind === "audio") {
      this.audioConsumerSets[localId] = set;
    } else {
      console.warn("WARN: addConsumerSet() UNKNWON kind=%s", kind);
    }
  }

  removeConsumerSetDeep(localId: string) {
    const videoSet = this.getConsumerSet(localId, "video");
    delete this.videoConsumerSets[localId];
    if (videoSet) {
      for (const key in videoSet) {
        const consumer = videoSet[key];
        consumer.close();
        delete videoSet[key];
      }

      console.log("room=%s removeConsumerSetDeep video consumers count=%d", this.name, Object.keys(videoSet).length);
    }

    const audioSet = this.getConsumerSet(localId, "audio");
    delete this.audioConsumerSets[localId];
    if (audioSet) {
      for (const key in audioSet) {
        const consumer = audioSet[key];
        consumer.close();
        delete audioSet[key];
      }

      console.log("room=%s removeConsumerSetDeep audio consumers count=%d", this.name, Object.keys(audioSet).length);
    }
  }

  getConsumer(localId: string, remoteId: string, kind: string) {
    const set = this.getConsumerSet(localId, kind);
    if (set) {
      return set[remoteId];
    } else {
      return null;
    }
  }

  addConsumer(localId: string, remoteId: string, consumer: mediasoup.types.Consumer, kind: string) {
    const set = this.getConsumerSet(localId, kind);
    if (set) {
      set[remoteId] = consumer;
      console.log("room=%s consumers kind=%s count=%d", this.name, kind, Object.keys(set).length);
    } else {
      console.log("room=%s new set for kind=%s, localId=%s", this.name, kind, localId);
      const newSet: { [id: string]: mediasoup.types.Consumer } = {};
      newSet[remoteId] = consumer;
      this.addConsumerSet(localId, newSet, kind);
      console.log("room=%s consumers kind=%s count=%d", this.name, kind, Object.keys(newSet).length);
    }
  }

  removeConsumer(localId: string, remoteId: string, kind: string) {
    const set = this.getConsumerSet(localId, kind);
    if (set) {
      delete set[remoteId];
      console.log("room=%s consumers kind=%s count=%d", this.name, kind, Object.keys(set).length);
    } else {
      console.log("NO set for room=%s kind=%s, localId=%s", this.name, kind, localId);
    }
  }

  // --- static methtod ---
  static staticInit() {
    this.rooms = {};
  }

  static addRoom(room: Room, name: string) {
    Room.rooms[name] = room;
    console.log("static addRoom. name=%s", room.name);
    //console.log('static addRoom. name=%s, rooms:%O', room.name, room);
  }

  static getRoom(name: string) {
    return Room.rooms[name];
  }

  static removeRoom(name: string) {
    delete Room.rooms[name];
  }

  static rooms: {
    [name: string]: Room;
  } = {};
}

let defaultRoom: Room;
let worker: mediasoup.types.Worker;
//let router = null;
//let producerTransport = null;
//let producer = null;
//let consumerTransport = null;
//let subscribeConsumer = null;

const setupRoom = async (name: string) => {
  const router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        parameters: {
          "x-google-start-bitrate": 1000,
        },
      },
    ],
  });
  const room = new Room(name, router);

  router.observer.on("close", () => {
    console.log("-- router closed. room=%s", name);
  });
  router.observer.on("newtransport", () => {
    console.log("-- router newtransport. room=%s", name);
  });

  Room.addRoom(room, name);
  return room;
};

const startWorker = async () => {
  worker = await mediasoup.createWorker();
  //router = await worker.createRouter({ mediaCodecs });
  //producerTransport = await router.createWebRtcTransport(mediasoupOptions.webRtcTransport);

  defaultRoom = await setupRoom("_default_room");
  console.log("-- mediasoup worker start. -- room:", defaultRoom.name);
};

(async () => {
  await startWorker();
})();

export const sfuChatSocketRoute = (webServer: http.Server) => {
  // --- default room ---

  const io = socketIO(webServer);

  io.on("connection", (socket: SFUSocket) => {
    console.log("client connected. socket id=" + getId(socket) + "  , total clients=" + getClientCount());

    // --- send response to client ---
    const sendResponse = (response: any, callback: any) => {
      //console.log('sendResponse() callback:', callback);
      callback(null, response);
    };

    // --- send error to client ---
    const sendReject = (error: any, callback: any) => {
      callback(error.toString(), null);
    };

    const sendback = (socket: SFUSocket, message: any) => {
      socket.emit("message", message);
    };

    const setRoomName = (roomName: string) => {
      socket.roomName = roomName;
    };

    const getRoomName = () => {
      const roomName = socket.roomName;
      return roomName;
    };

    socket.on("disconnect", () => {
      const roomName = getRoomName();

      // close user connection
      console.log("client disconnected. socket id=" + getId(socket) + "  , total clients=" + getClientCount());
      cleanUpPeer(roomName, socket);

      // --- socket.io room ---
      socket.leave(roomName);
    });
    socket.on("error", err => {
      console.error("socket ERROR:", err);
    });
    socket.on("connect_error", err => {
      console.error("client connection error", err);
    });

    socket.on("getRouterRtpCapabilities", (_, callback) => {
      const router = defaultRoom.router;

      if (router) {
        //console.log('getRouterRtpCapabilities: ', router.rtpCapabilities);
        sendResponse(router.rtpCapabilities, callback);
      } else {
        sendReject({ text: "ERROR- router NOT READY" }, callback);
      }
    });

    // --- setup room ---
    socket.on("prepare_room", async data => {
      const roomName = data.roomName;
      const existRoom = Room.getRoom(roomName);
      if (existRoom) {
        console.log("--- use exist room. roomName=" + roomName);
      } else {
        console.log("--- create new room. roomName=" + roomName);
        await setupRoom(roomName);
      }

      // --- socket.io room ---
      socket.join(roomName);
      setRoomName(roomName);
    });

    // --- producer ----
    socket.on("createProducerTransport", async (_, callback) => {
      const roomName = getRoomName();

      console.log("-- createProducerTransport ---room=%s", roomName);
      const { transport, params } = await createTransport(roomName);
      addProducerTrasport(roomName, getId(socket), transport);
      transport.observer.on("close", () => {
        const id = getId(socket);
        const videoProducer = getProducer(roomName, id, "video");
        if (videoProducer) {
          videoProducer.close();
          removeProducer(roomName, id, "video");
        }
        const audioProducer = getProducer(roomName, id, "audio");
        if (audioProducer) {
          audioProducer.close();
          removeProducer(roomName, id, "audio");
        }
        removeProducerTransport(roomName, id);
      });
      //console.log('-- createProducerTransport params:', params);
      sendResponse(params, callback);
    });

    socket.on("connectProducerTransport", async (data, callback) => {
      const roomName = getRoomName();
      const transport = getProducerTrasnport(roomName, getId(socket));
      if (transport) await transport.connect({ dtlsParameters: data.dtlsParameters });
      sendResponse({}, callback);
    });

    socket.on("produce", async (data, callback) => {
      const roomName = getRoomName();
      const { kind, rtpParameters } = data;
      console.log("-- produce --- kind=" + kind);
      const id = getId(socket);
      const transport = getProducerTrasnport(roomName, id);
      if (!transport) {
        console.error("transport NOT EXIST for id=" + id);
        return;
      }
      const producer = await transport.produce({ kind, rtpParameters });
      addProducer(roomName, id, producer, kind);
      producer.observer.on("close", () => {
        console.log("producer closed --- kind=" + kind);
      });
      sendResponse({ id: producer.id }, callback);

      // inform clients about new producer

      if (roomName) {
        console.log("--broadcast room=%s newProducer ---", roomName);
        socket.broadcast
          .to(roomName)
          .emit("newProducer", { socketId: id, producerId: producer.id, kind: producer.kind });
      } else {
        console.log("--broadcast newProducer ---");
        socket.broadcast.emit("newProducer", { socketId: id, producerId: producer.id, kind: producer.kind });
      }
    });

    // --- consumer ----
    socket.on("createConsumerTransport", async (_, callback) => {
      const roomName = getRoomName();
      console.log("-- createConsumerTransport -- id=" + getId(socket));
      const { transport, params } = await createTransport(roomName);
      addConsumerTrasport(roomName, getId(socket), transport);
      transport.observer.on("close", () => {
        const localId = getId(socket);
        removeConsumerSetDeep(roomName, localId);
        removeConsumerTransport(roomName, localId);
      });
      //console.log('-- createTransport params:', params);
      sendResponse(params, callback);
    });

    socket.on("connectConsumerTransport", async (data, callback) => {
      const roomName = getRoomName();
      console.log("-- connectConsumerTransport -- id=" + getId(socket));
      let transport = getConsumerTrasnport(roomName, getId(socket));
      if (!transport) {
        console.error("transport NOT EXIST for id=" + getId(socket));
        return;
      }
      await transport.connect({ dtlsParameters: data.dtlsParameters });
      sendResponse({}, callback);
    });

    socket.on("consume", async () => {
      console.error("-- ERROR: consume NOT SUPPORTED ---");
      return;
    });

    socket.on("resume", async () => {
      console.error("-- ERROR: resume NOT SUPPORTED ---");
      return;
    });

    socket.on("getCurrentProducers", async (data, callback) => {
      const roomName = getRoomName();
      const clientId = data.localId;
      console.log("-- getCurrentProducers for Id=" + clientId);

      const remoteVideoIds = getRemoteIds(roomName, clientId, "video");
      console.log("-- remoteVideoIds:", remoteVideoIds);
      const remoteAudioIds = getRemoteIds(roomName, clientId, "audio");
      console.log("-- remoteAudioIds:", remoteAudioIds);

      sendResponse({ remoteVideoIds: remoteVideoIds, remoteAudioIds: remoteAudioIds }, callback);
    });

    socket.on("consumeAdd", async (data, callback) => {
      const roomName = getRoomName();
      const localId = getId(socket);
      const kind = data.kind;
      console.log("-- consumeAdd -- localId=%s kind=%s", localId, kind);

      let transport = getConsumerTrasnport(roomName, localId);
      if (!transport) {
        console.error("transport NOT EXIST for id=" + localId);
        return;
      }
      const rtpCapabilities = data.rtpCapabilities;
      const remoteId = data.remoteId;
      console.log("-- consumeAdd - localId=" + localId + " remoteId=" + remoteId + " kind=" + kind);
      const producer = getProducer(roomName, remoteId, kind);
      if (!producer) {
        console.error("producer NOT EXIST for remoteId=%s kind=%s", remoteId, kind);
        return;
      }
      const { consumer, params } = await createConsumer(roomName, transport, producer, rtpCapabilities); // producer must exist before consume
      if (!consumer || !params) return;

      //subscribeConsumer = consumer;
      addConsumer(roomName, localId, remoteId, consumer, kind); // TODO: MUST comination of  local/remote id
      console.log("addConsumer localId=%s, remoteId=%s, kind=%s", localId, remoteId, kind);
      consumer.observer.on("close", () => {
        console.log("consumer closed ---");
      });
      consumer.on("producerclose", () => {
        console.log("consumer -- on.producerclose");
        consumer.close();
        removeConsumer(roomName, localId, remoteId, kind);

        // -- notify to client ---
        socket.emit("producerClosed", { localId: localId, remoteId: remoteId, kind: kind });
      });

      console.log("-- consumer ready ---");
      sendResponse(params, callback);
    });

    socket.on("resumeAdd", async (data, callback) => {
      const roomName = getRoomName();
      const localId = getId(socket);
      const remoteId = data.remoteId;
      const kind = data.kind;
      console.log("-- resumeAdd localId=%s remoteId=%s kind=%s", localId, remoteId, kind);
      let consumer = getConsumer(roomName, localId, remoteId, kind);
      if (!consumer) {
        console.error("consumer NOT EXIST for remoteId=" + remoteId);
        return;
      }
      await consumer.resume();
      sendResponse({}, callback);
    });

    // ---- sendback welcome message with on connected ---
    const newId = getId(socket);
    sendback(socket, { type: "welcome", id: newId });
  });

  const getId = (socket: SFUSocket) => {
    return socket.id;
  };

  //function sendNotification(socket, message) {
  //  socket.emit('notificatinon', message);
  //}

  const getClientCount = () => {
    // WARN: undocumented method to get clients number

    return io.clients.length;
  };

  const cleanUpPeer = (roomname: string, socket: SFUSocket) => {
    const id = getId(socket);
    removeConsumerSetDeep(roomname, id);

    const transport = getConsumerTrasnport(roomname, id);
    if (transport) {
      transport.close();
      removeConsumerTransport(roomname, id);
    }

    const videoProducer = getProducer(roomname, id, "video");
    if (videoProducer) {
      videoProducer.close();
      removeProducer(roomname, id, "video");
    }
    const audioProducer = getProducer(roomname, id, "audio");
    if (audioProducer) {
      audioProducer.close();
      removeProducer(roomname, id, "audio");
    }

    const producerTransport = getProducerTrasnport(roomname, id);
    if (producerTransport) {
      producerTransport.close();
      removeProducerTransport(roomname, id);
    }
  };

  // -- static member --
  Room.rooms = {};

  // ========= mediasoup ===========

  //
  // Room {
  //   id,
  //   transports[],
  //   consumers[],
  //   producers[],
  // }
  //

  // --- multi-producers --
  //let producerTransports = {};
  //let videoProducers = {};
  //let audioProducers = {};

  const getProducerTrasnport = (roomname: string, id: string) => {
    if (roomname) {
      console.log("=== getProducerTrasnport use room=%s ===", roomname);
      const room = Room.getRoom(roomname);
      return room.getProducerTrasnport(id);
    } else {
      console.log("=== getProducerTrasnport use defaultRoom room=%s ===", roomname);
      return defaultRoom.getProducerTrasnport(id);
    }
  };

  const addProducerTrasport = (roomname: string, id: string, transport: mediasoup.types.WebRtcTransport) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.addProducerTrasport(id, transport);
      console.log("=== addProducerTrasport use room=%s ===", roomname);
    } else {
      defaultRoom.addProducerTrasport(id, transport);
      console.log("=== addProducerTrasport use defaultRoom room=%s ===", roomname);
    }
  };

  const removeProducerTransport = (roomname: string, id: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.removeProducerTransport(id);
    } else {
      defaultRoom.removeProducerTransport(id);
    }
  };

  const getProducer = (roomname: string, id: string, kind: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      return room.getProducer(id, kind);
    } else {
      return defaultRoom.getProducer(id, kind);
    }
  };

  const getRemoteIds = (roomname: string, clientId: string, kind: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      return room.getRemoteIds(clientId, kind);
    } else {
      return defaultRoom.getRemoteIds(clientId, kind);
    }
  };

  const addProducer = (roomname: string, id: string, producer: mediasoup.types.Producer, kind: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.addProducer(id, producer, kind);
      console.log("=== addProducer use room=%s ===", roomname);
    } else {
      defaultRoom.addProducer(id, producer, kind);
      console.log("=== addProducer use defaultRoom room=%s ===", roomname);
    }
  };

  const removeProducer = (roomname: string, id: string, kind: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.removeProducer(id, kind);
    } else {
      defaultRoom.removeProducer(id, kind);
    }
  };

  // --- multi-consumers --
  //let consumerTransports = {};
  //let videoConsumers = {};
  //let audioConsumers = {};

  const getConsumerTrasnport = (roomname: string, id: string) => {
    if (roomname) {
      console.log("=== getConsumerTrasnport use room=%s ===", roomname);
      const room = Room.getRoom(roomname);
      return room.getConsumerTrasnport(id);
    } else {
      console.log("=== getConsumerTrasnport use defaultRoom room=%s ===", roomname);
      return defaultRoom.getConsumerTrasnport(id);
    }
  };

  const addConsumerTrasport = (roomname: string, id: string, transport: mediasoup.types.WebRtcTransport) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.addConsumerTrasport(id, transport);
      console.log("=== addConsumerTrasport use room=%s ===", roomname);
    } else {
      defaultRoom.addConsumerTrasport(id, transport);
      console.log("=== addConsumerTrasport use defaultRoom room=%s ===", roomname);
    }
  };

  const removeConsumerTransport = (roomname: string, id: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.removeConsumerTransport(id);
    } else {
      defaultRoom.removeConsumerTransport(id);
    }
  };

  // function getConsumerSet(localId, kind) {
  //   if (kind === 'video') {
  //     return videoConsumers[localId];
  //   }
  //   else if (kind === 'audio') {
  //     return audioConsumers[localId];
  //   }
  //   else {
  //     console.warn('WARN: getConsumerSet() UNKNWON kind=%s', kind);
  //   }
  // }

  const getConsumer = (roomname: string, localId: string, remoteId: string, kind: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      return room.getConsumer(localId, remoteId, kind);
    } else {
      return defaultRoom.getConsumer(localId, remoteId, kind);
    }
  };

  const addConsumer = (
    roomname: string,
    localId: string,
    remoteId: string,
    consumer: mediasoup.types.Consumer,
    kind: string,
  ) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.addConsumer(localId, remoteId, consumer, kind);
      console.log("=== addConsumer use room=%s ===", roomname);
    } else {
      defaultRoom.addConsumer(localId, remoteId, consumer, kind);
      console.log("=== addConsumer use defaultRoom room=%s ===", roomname);
    }
  };

  const removeConsumer = (roomname: string, localId: string, remoteId: string, kind: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.removeConsumer(localId, remoteId, kind);
    } else {
      defaultRoom.removeConsumer(localId, remoteId, kind);
    }
  };

  const removeConsumerSetDeep = (roomname: string, localId: string) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.removeConsumerSetDeep(localId);
    } else {
      defaultRoom.removeConsumerSetDeep(localId);
    }
  };

  // function addConsumerSet(localId, set, kind) {
  //   if (kind === 'video') {
  //     videoConsumers[localId] = set;
  //   }
  //   else if (kind === 'audio') {
  //     audioConsumers[localId] = set;
  //   }
  //   else {
  //     console.warn('WARN: addConsumerSet() UNKNWON kind=%s', kind);
  //   }
  // }

  const createTransport = async (roomname: string) => {
    let router: mediasoup.types.Router | undefined;
    if (roomname) {
      const room = Room.getRoom(roomname);
      router = room.router;
    } else {
      router = defaultRoom.router;
    }

    const transport = await router.createWebRtcTransport({
      listenIps: [{ ip: "127.0.0.1" }, { ip: "0.0.0.0", announcedIp: process.env.PUBLIC_IP }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: 1000000,
    });
    console.log("-- create transport room=%s id=%s", roomname, transport.id);

    return {
      transport: transport,
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    };
  };

  const createConsumer = async (
    roomname: string,
    transport: mediasoup.types.WebRtcTransport,
    producer: mediasoup.types.Producer,
    rtpCapabilities: any,
  ) => {
    let router = null;
    if (roomname) {
      const room = Room.getRoom(roomname);
      router = room.router;
    } else {
      router = defaultRoom.router;
    }

    if (
      !router.canConsume({
        producerId: producer.id,
        rtpCapabilities,
      })
    ) {
      console.error("can not consume");
      return {
        consumer: null,
        params: {
          producerId: null,
          id: null,
          kind: null,
          rtpParameters: null,
          type: null,
          producerPaused: null,
        },
      };
    }

    let consumer = null;
    //consumer = await producerTransport.consume({ // NG: try use same trasport as producer (for loopback)
    consumer = await transport
      .consume({
        // OK
        producerId: producer.id,
        rtpCapabilities,
        paused: producer.kind === "video",
      })
      .catch(err => {
        console.error("consume failed", err);
        return;
      });

    //if (consumer.type === 'simulcast') {
    //  await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
    //}

    if (!consumer) {
      return {
        consumer: null,
        params: {
          producerId: null,
          id: null,
          kind: null,
          rtpParameters: null,
          type: null,
          producerPaused: null,
        },
      };
    }

    return {
      consumer: consumer,
      params: {
        producerId: producer.id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused,
      },
    };
  };
};
