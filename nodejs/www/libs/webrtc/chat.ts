let peerConnection: RTCPeerConnection;
let negotiationneededCounter = 0;
let ws: WebSocket;
let chatID: string;
let closeFlag = false;

const rtcConfig = {
  sdpSemantics: "unified-plan",
  iceServers: [
    { urls: "turn:syonet.work:3478", credential: "chat", username: "syonet" },
  ],
};

// Videoの再生を開始する
export const playVideo = async (element: HTMLVideoElement, stream: MediaStream) => {
  element.srcObject = stream;
};

const getWSUrl = (chatID: string) => {
  if (process.env.WWW_DOMAIN === "syonet.work") return `wss://${process.env.WWW_DOMAIN}/chat/${chatID}`;

  return `ws://${process.env.WWW_DOMAIN}:9001/chat/${chatID}`;
};

// ICE candaidate受信時にセットする
const addIceCandidate = async (candidate: RTCIceCandidate) => {
  if (peerConnection) {
    await peerConnection.addIceCandidate(candidate);
  } else {
    console.error("PeerConnection not exist!");
  }
};

export const connectSignaling = (id: string) => {
  chatID = id;
  const wsUrl = getWSUrl(chatID);
  ws = new WebSocket(wsUrl);
  ws.onopen = async() => {
    await connectWebRTC();
  };
  ws.onerror = err => {
    console.error(err);
  };
  ws.onmessage = async evt => {
    const message = JSON.parse(evt.data);
    console.log(message);
    switch (message.type) {
      case "offer": {
        const sessionDescription = new RTCSessionDescription(message);
        await setOffer(sessionDescription);
        break;
      }
      case "answer": {
        const sessionDescription = new RTCSessionDescription(message);
        await setAnswer(sessionDescription);
        break;
      }
      case "candidate": {
        const candidate = new RTCIceCandidate(message.ice);
        await addIceCandidate(candidate);
        break;
      }
      case "close": {
        hangUp();
        break;
      }
      default: {
        break;
      }
    }
  };
  ws.onclose = () => {
    if (!closeFlag) {
      const wsUrl = `wss://${process.env.WWW_DOMAIN}/chat/${chatID}`;
      ws = new WebSocket(wsUrl);
    }
    console.info("close chat");
  };
  return ws;
};

// ICE candidate生成時に送信する
const sendIceCandidate = (candidate: RTCIceCandidate) => {
  const message = JSON.stringify({ type: "candidate", ice: candidate, chatID });
  ws.send(message);
};

// WebRTCを利用する準備をする
const prepareNewConnection = (isOffer: boolean, peerConnection: RTCPeerConnection) => {
  // リモートのMediStreamTrackを受信した時
  peerConnection.ontrack = evt => {
    console.log("ontrack");
    const remoteVideoArea = document.getElementById("remoteVideoArea");
    if (!remoteVideoArea) return;

    const videoElement = document.createElement("video");
    videoElement.setAttribute("controls", "true");
    videoElement.setAttribute("autoplay", "true");
    videoElement.setAttribute("playsinline", "true");
    videoElement.setAttribute("style", "width: 30%;");
    remoteVideoArea.appendChild(videoElement);
    playVideo(videoElement, evt.streams[0]);
  };

  peerConnection.onconnectionstatechange = () => {
    if (peerConnection.connectionState === "connected") {
      const tracks = peerConnection.getReceivers().map(r => r.track);
      const stream = new MediaStream(tracks);
      console.log(stream);
    }
  };
  // ICE Candidateを収集したときのイベント
  peerConnection.onicecandidate = evt => {
    console.log("onicecandidate");
    if (evt.candidate) {
      sendIceCandidate(evt.candidate);
    }
  };

  // Offer側でネゴシエーションが必要になったときの処理
  peerConnection.onnegotiationneeded = async () => {
    console.log("onnegotiationneeded");
    try {
      if (isOffer) {
        if (negotiationneededCounter === 0) {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          sendSdp(peerConnection.localDescription);
          negotiationneededCounter++;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ICEのステータスが変更になったときの処理
  peerConnection.oniceconnectionstatechange = () => {
    console.log("onnegotiationneeded");
    switch (peerConnection.iceConnectionState) {
      case "closed":
      case "failed":
        if (peerConnection) {
          hangUp();
        }
        break;
      case "disconnected":
        break;
    }
  };

  return peerConnection;
};

// 手動シグナリングのための処理を追加する
const sendSdp = (sessionDescription: RTCSessionDescription | null) => {
  const message = JSON.stringify({ ...sessionDescription?.toJSON(), chatID });
  ws.send(message);
};

// Connectボタンが押されたらWebRTCのOffer処理を開始
const connectWebRTC = async () => {
  if (!peerConnection) {
    peerConnection = prepareNewConnection(true, new RTCPeerConnection(rtcConfig));
  } else {
    console.warn("peer already exist.");
  }
};

export const changeSelfVideoStream = async (selfVideoStream: MediaStream) => {
  const offer = await peerConnection.createOffer();
  const sessionDescription = new RTCSessionDescription(offer);
  await peerConnection.setLocalDescription(sessionDescription);
  sendSdp(sessionDescription);
  for (const track of selfVideoStream.getTracks()) {
    peerConnection.addTrack(track, selfVideoStream);
  }
};

// Answer SDPを生成する
const makeAnswer = async () => {
  if (!peerConnection) {
    console.error("peerConnection NOT exist!");
    return;
  }
  try {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendSdp(peerConnection.localDescription);
  } catch (err) {
    console.error(err);
  }
};

// Offer側のSDPをセットする処理
const setOffer = async (sessionDescription: RTCSessionDescription) => {
  peerConnection = prepareNewConnection(false, new RTCPeerConnection(rtcConfig));

  try {
    await peerConnection.setRemoteDescription(sessionDescription);
    await makeAnswer();
  } catch (err) {
    console.error(err);
  }
};

// Answer側のSDPをセットする場合
const setAnswer = async (sessionDescription: RTCSessionDescription) => {
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

// P2P通信を切断する
const hangUp = () => {
  console.info("hangUp");
  if (peerConnection) {
    if (peerConnection.iceConnectionState !== "closed") {
      peerConnection.close();
      negotiationneededCounter = 0;
      const message = JSON.stringify({ type: "close", chatID });
      ws.send(message);
      return;
    }
  }
};

export const closeSignaling = () => {
  console.info("closing chat");
  closeFlag = true;
  ws.close();
};
