let peerConnection: RTCPeerConnection | null = null;
let negotiationneededCounter = 0;
let ws: WebSocket;

const rtcConfig = {
  iceServers: [{ urls: `turn:syonet:3478`, credential: "chat", username: "syonet" }],
};

// シグナリングサーバへ接続する
const wsUrl = `wss://${process.env.WWW_DOMAIN}/chat/`;

// Videoの再生を開始する
export const playVideo = async (element: HTMLVideoElement, stream: MediaStream) => {
  element.srcObject = stream;
  try {
    await element.play();
  } catch (error) {
    console.error(error);
  }
};

export const connectSignaling = () => {
  ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    // console.log("ws open()");
  };
  ws.onerror = err => {
    console.error(err);
  };
  ws.onmessage = async evt => {
    const message = JSON.parse(evt.data);
    switch (message.type) {
      case "offer": {
        setOffer(message);
        break;
      }
      case "answer": {
        setAnswer(message);
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

  return ws;
};

// ICE candaidate受信時にセットする
const addIceCandidate = async (candidate: RTCIceCandidate) => {
  if (peerConnection) {
    await peerConnection.addIceCandidate(candidate);
  } else {
    console.error("PeerConnection not exist!");
  }
};

// ICE candidate生成時に送信する
const sendIceCandidate = (candidate: RTCIceCandidate) => {
  const message = JSON.stringify({ type: "candidate", ice: candidate });
  ws.send(message);
};

// WebRTCを利用する準備をする
const prepareNewConnection = (isOffer: boolean, peer: RTCPeerConnection) => {
  // リモートのMediStreamTrackを受信した時
  peer.ontrack = evt => {
    console.log(evt);
  };

  // ICE Candidateを収集したときのイベント
  peer.onicecandidate = evt => {
    if (evt.candidate) {
      sendIceCandidate(evt.candidate);
    }
  };

  // Offer側でネゴシエーションが必要になったときの処理
  peer.onnegotiationneeded = async () => {
    try {
      if (isOffer) {
        if (negotiationneededCounter === 0) {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          sendSdp(peer.localDescription);
          negotiationneededCounter++;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ICEのステータスが変更になったときの処理
  peer.oniceconnectionstatechange = function() {
    switch (peer.iceConnectionState) {
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

  return peer;
};

// 手動シグナリングのための処理を追加する
const sendSdp = (sessionDescription: RTCSessionDescription | null) => {
  const message = JSON.stringify(sessionDescription);
  ws.send(message);
};

// Connectボタンが押されたらWebRTCのOffer処理を開始
export const connectWebRTC = (selfVideoStream: MediaStream) => {
  if (!peerConnection) {
    const peer = new RTCPeerConnection(rtcConfig);
    for (const track of selfVideoStream.getTracks()) {
      peer.addTrack(track, selfVideoStream);
    }
    peerConnection = prepareNewConnection(true, peer);
  } else {
    console.warn("peer already exist.");
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
  const peer = new RTCPeerConnection(rtcConfig);
  peerConnection = prepareNewConnection(false, peer);

  try {
    await peerConnection.setRemoteDescription(sessionDescription);
    makeAnswer();
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
  if (peerConnection) {
    if (peerConnection.iceConnectionState !== "closed") {
      peerConnection.close();
      peerConnection = null;
      negotiationneededCounter = 0;
      const message = JSON.stringify({ type: "close" });
      ws.send(message);
      return;
    }
  }
};
