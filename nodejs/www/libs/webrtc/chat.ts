import { toolsChatStyle } from "@www/styles";

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
export const playVideo = async (element: HTMLVideoElement, stream: MediaStream) => {
  element.srcObject = stream;
};

const getWSUrl = (chatID: string) => {
  if (process.env.WWW_DOMAIN === "syonet.work") return `wss://${process.env.WWW_DOMAIN}/chat/${chatID}`;

  return `ws://${process.env.WWW_DOMAIN}:9001/chat/${chatID}`;
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
  };
  ws.onerror = err => {
    console.error(err);
  };
  ws.onmessage = async evt => {
    const message = JSON.parse(evt.data);
    console.log(peerConnections);
    console.log(message);
    if (message.type)
      switch (message.type) {
        case "create": {
          console.log("create");

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
          }
          break;
        }
        case "create_mcu_peer_connection": {
          console.log("create_mcu_peer_connection");
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
          console.log("create_client_peer_connection");
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
          console.log("mcu_local_offer");

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
          console.log("mcu_remote_offer");
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
          console.log("mcu_local_answer");
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
          console.log("mcu_remote_answer");
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
          console.log("client_local_offer");
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
          console.log("client_remote_offer");
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
          console.log("client_local_answer");
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
          console.log("client_remote_answer");
          const uuid = isMCU() ? message.clientUUID : message.mcuUUID;
          const peerConnection = peerConnections[uuid];
          await setRemoteDescription(message.sessionDescription, peerConnection);
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
          console.log("candidate");
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
  peerConnection.ontrack = evt => {
    console.log("ontrack");
    const remoteVideoArea = document.getElementById("remoteVideoArea");
    if (!remoteVideoArea) return;
    console.log(evt);

    const stream = evt.streams[0];
    const videoId = `video-${stream.id}`;
    let videoElement: HTMLVideoElement = document.getElementById(videoId) as HTMLVideoElement;
    if (!videoElement) {
      videoElement = document.createElement("video");
      videoElement.setAttribute("id", videoId);
      videoElement.setAttribute("controls", "true");
      videoElement.setAttribute("autoplay", "true");
      videoElement.setAttribute("playsinline", "true");
      videoElement.setAttribute("class", toolsChatStyle.video);
      remoteVideoArea.appendChild(videoElement);
    }
    playVideo(videoElement, stream);

    if (isMCU()) {
      console.log("ontarack mcu");
      for (const key in peerConnections) {
        const peerConnection = peerConnections[key];
        if (peerConnection) {
          remoteVideoArea.childNodes.forEach(element => {
            const video = element as HTMLMediaElement;
            const mediaStream = video.srcObject as MediaStream;
            if (!mediaStream.active) {
              ws.send(
                JSON.stringify({
                  type: "delete",
                  mediaStreamId: video.id.replace(/^video-/, ""),
                  chatID,
                }),
              );
            }
          });
          for (const track of stream.getTracks()) {
            try {
              peerConnection.addTrack(track, stream);
            } catch (error) {
              console.warn(error);
            }
          }
        }
      }
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
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  };

  // ICEのステータスが変更になったときの処理
  peerConnection.oniceconnectionstatechange = () => {
    console.log("oniceconnectionstatechange");
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
  console.log("streamUpdate");
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
    console.log(sessionDescription);
    await peerConnection.setRemoteDescription(sessionDescription);
  } catch (err) {
    console.error(err);
  }
};

export const closeSignaling = () => {
  console.info("closing chat");
  ws.close();
};
