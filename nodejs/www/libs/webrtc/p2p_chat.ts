import toolsP2PChatStyle from "@www/styles/tools/p2p_chat.module.css";

let peerConnections: {
  [uuid: string]: RTCPeerConnection
} = {};
let selfVideoStream: {
  now: MediaStream | null;
  old: MediaStream | null;
} = {
  now: null,
  old: null
};
let uuid: string;
let ws: WebSocket;
let chatID: string;
let trackSender: RTCRtpSender | null;

const rtcConfig = {
  iceServers: [
    { urls: "turn:syonet.work:3478", credential: "chat", username: "syonet" },
  ],
};

// Videoの再生を開始する
export const playVideo = async (element: HTMLVideoElement, stream: MediaStream) => {
  element.srcObject = stream;
};

const getWSUrl = (chatID: string) => {
  if (process.env.WWW_DOMAIN === "syonet.work") return `wss://${process.env.WWW_DOMAIN}/p2p_chat/${chatID}`;

  return `ws://${process.env.WWW_DOMAIN}:9002/p2p_chat/${chatID}`;
};

export const connectChat = (id: string) => {
  chatID = id;
  const wsUrl = getWSUrl(chatID);
  ws = new WebSocket(wsUrl);
  ws.onopen = async() => {
    ws.send(JSON.stringify({
      type: "create",
      chatID
    }));
  };
  ws.onerror = err => {
    console.error(err);
  };
  ws.onmessage = async evt => {
    const message = JSON.parse(evt.data);
    // console.log(message);
    const peerConnection = peerConnections[message.uuid];
    if (message.type) switch (message.type) {
      case "create": {
        uuid = message.uuid;
        setInterval(() => {
          ws.send(JSON.stringify({
            type: "sync",
            chatID,
            uuid
          }));
        }, 10000);
        break;
      }
      case "sync": {
        connectWebRTC(message.uuid);
        ws.send(JSON.stringify({
          type: "streamUpdate",
          chatID,
          uuid
        }));
        break;
      }
      case "streamUpdate": {
        console.log("streamUpdate");
        if (peerConnection) streamUpdate(peerConnection);
        break;
      }
      case "delete": {
        console.log("delete");
        const videoId = `video-${message.mediaStreamId}`;
        const videoElement: HTMLVideoElement = document.getElementById(videoId) as HTMLVideoElement;
        if (videoElement) {
          videoElement.remove();
        }
        break;
      }
      case "candidate": {
        if (!peerConnection) break;
        const candidate = new RTCIceCandidate(message.ice);
        await peerConnection.addIceCandidate(candidate);
        break;
      }
      case "close": {
        if (!peerConnection) break;
        hangUp(peerConnection);
        break;
      }
    }

    if (message.sessionDescription) switch (message.sessionDescription.type) {
      case "offer": {
        if (!peerConnection) break;
        const sessionDescription = new RTCSessionDescription(message.sessionDescription);
        await setOffer(sessionDescription, peerConnection);
        break;
      }
      case "answer": {
        if (!peerConnection) break;
        const sessionDescription = new RTCSessionDescription(message.sessionDescription);
        await setAnswer(sessionDescription, peerConnection);
        break;
      }
      default: {
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
  const message = JSON.stringify({ type: "candidate", ice: candidate, chatID });
  ws.send(message);
};

// WebRTCを利用する準備をする
const prepareNewConnection = (peerConnection: RTCPeerConnection) => {
  // リモートのMediStreamTrackを受信した時
  peerConnection.ontrack = evt => {
    const remoteVideoArea = document.getElementById("remoteVideoArea");
    if (!remoteVideoArea) return;

    const stream = evt.streams[0];
    const videoId = `video-${stream.id}`;
    let videoElement: HTMLVideoElement = document.getElementById(videoId) as HTMLVideoElement;
    if (!videoElement) {
      videoElement = document.createElement("video");
      videoElement.setAttribute("id", videoId);
      videoElement.setAttribute("controls", "true");
      videoElement.setAttribute("autoplay", "true");
      videoElement.setAttribute("playsinline", "true");
      videoElement.setAttribute("class", toolsP2PChatStyle.video);
      remoteVideoArea.appendChild(videoElement);
    }
    playVideo(videoElement, stream);
  };

  // ICE Candidateを収集したときのイベント
  peerConnection.onicecandidate = evt => {
    if (evt.candidate) {
      sendIceCandidate(evt.candidate);
    }
  };

  // Offer側でネゴシエーションが必要になったときの処理
  peerConnection.onnegotiationneeded = async () => {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      sendSdp(peerConnection.localDescription);
    } catch (err) {
      console.error(err);
    }
  };

  // ICEのステータスが変更になったときの処理
  peerConnection.oniceconnectionstatechange = () => {
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

// 手動シグナリングのための処理を追加する
const sendSdp = (sessionDescription: RTCSessionDescription | null) => {
  const message = JSON.stringify({ 
    sessionDescription: sessionDescription?.toJSON(),
    chatID,
    uuid
  });
  ws.send(message);
};

const connectWebRTC = async (targetUUID: string) => {
  let peerConnection = peerConnections[targetUUID];
  if (!peerConnection) {
    peerConnection = prepareNewConnection(new RTCPeerConnection(rtcConfig));
    const offer = await peerConnection.createOffer();
    const sessionDescription = new RTCSessionDescription(offer);
    setOffer(sessionDescription, peerConnection);
    peerConnections[targetUUID] = peerConnection;
  } else {
    console.warn("peer already exist.");
  }
};

const streamUpdate = (peerConnection: RTCPeerConnection) => {
  try {
    if (selfVideoStream.old) {
      ws.send(JSON.stringify({
        type: "delete",
        mediaStreamId: selfVideoStream.old.id,
        chatID
      }));
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

export const changeSelfVideoStream = async (oldSelfVideoStream: MediaStream | null, newSelfVideoStream: MediaStream) => {
  selfVideoStream.old = oldSelfVideoStream;
  selfVideoStream.now = newSelfVideoStream;
};

// Answer SDPを生成する
const makeAnswer = async (peerConnection: RTCPeerConnection) => {
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
const setOffer = async (sessionDescription: RTCSessionDescription, peerConnection: RTCPeerConnection) => {
  try {
    await peerConnection.setRemoteDescription(sessionDescription);
    await makeAnswer(peerConnection);
  } catch (err) {
    console.error(err);
  }
};

// Answer側のSDPをセットする場合
const setAnswer = async (sessionDescription: RTCSessionDescription, peerConnection: RTCPeerConnection) => {
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

export const closeSignaling = () => {
  console.info("closing chat");
  ws.close();
};
