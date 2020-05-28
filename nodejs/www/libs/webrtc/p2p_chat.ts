import { toolsP2PChatStyle } from "@www/styles";

let peerConnections: {
  [uuid: string]: RTCPeerConnection | undefined;
} = {};
let candidatedes: {
  [uuid: string]: boolean | undefined;
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
// let trackSender: RTCRtpSender | null;
let clientUUID: string;

const rtcConfig = {
  iceServers: [{ urls: "turn:syonet.work:3478", credential: "chat", username: "syonet" }],
};

// Videoの再生を開始する
export const playVideo = (element: HTMLVideoElement, stream: MediaStream) => {
  element.srcObject = stream;
  element.controls = true;
  element.autoplay = true;
  element.muted = true;
};

const getWSUrl = (chatID: string) => {
  if (process.env.WWW_DOMAIN === "syonet.work") return `wss://${process.env.WWW_DOMAIN}/p2p_chat/${chatID}`;

  return `ws://${process.env.WWW_DOMAIN}:9002/p2p_chat/${chatID}`;
};

export const connectChat = (id: string) => {
  chatID = id;
  const wsUrl = getWSUrl(chatID);
  ws = new WebSocket(wsUrl);

  ws.onopen = async () => {
    ws.send(
      JSON.stringify({
        type: "create",
        chatID,
      }),
    );

    setInterval(() => {
      ws.send(
        JSON.stringify({
          type: "ping",
          chatID,
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

          clientUUID = message.clientUUID;

          ws.send(
            JSON.stringify({
              type: "another_peer_connection",
              chatID,
              clientUUID,
              selfClientUUID: clientUUID,
            }),
          );
          break;
        }
        case "another_peer_connection": {
          console.info("another_peer_connection");
          await createPeerConnection(message.selfClientUUID);

          ws.send(
            JSON.stringify({
              type: "self_peer_connection",
              chatID,
              clientUUID,
              selfClientUUID: message.selfClientUUID,
              anotherClientUUID: clientUUID,
            }),
          );
          break;
        }
        case "self_peer_connection": {
          console.info("self_peer_connection");
          await createPeerConnection(message.anotherClientUUID);

          ws.send(
            JSON.stringify({
              type: "another_local_offer",
              chatID,
              clientUUID,
              selfClientUUID: clientUUID,
              anotherClientUUID: message.anotherClientUUID,
            }),
          );
          break;
        }
        case "another_local_offer": {
          console.info("another_local_offer");
          const peerConnection = peerConnections[message.selfClientUUID];
          if (!peerConnection) break;

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          ws.send(
            JSON.stringify({
              type: "another_remote_offer",
              chatID,
              clientUUID,
              selfClientUUID: message.selfClientUUID,
              anotherClientUUID: clientUUID,
              sessionDescription: peerConnection.localDescription,
            }),
          );
          break;
        }
        case "another_remote_offer": {
          console.info("another_remote_offer");
          const peerConnection = peerConnections[message.anotherClientUUID];
          if (!peerConnection) break;

          await setRemoteDescription(message.sessionDescription, peerConnection);

          ws.send(
            JSON.stringify({
              type: "another_local_answer",
              chatID,
              clientUUID,
              selfClientUUID: clientUUID,
              anotherClientUUID: message.anotherClientUUID,
            }),
          );
          break;
        }
        case "another_local_answer": {
          console.info("another_local_answer");
          const peerConnection = peerConnections[message.anotherClientUUID];
          if (!peerConnection) break;

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          ws.send(
            JSON.stringify({
              type: "another_remote_answer",
              chatID,
              clientUUID,
              selfClientUUID: clientUUID,
              anotherClientUUID: message.anotherClientUUID,
              sessionDescription: peerConnection.localDescription,
            }),
          );
          break;
        }
        case "another_remote_answer": {
          console.info("another_remote_answer");
          const peerConnection = peerConnections[message.selfClientUUID];
          if (!peerConnection) break;

          await setRemoteDescription(message.sessionDescription, peerConnection);

          ws.send(
            JSON.stringify({
              type: "self_local_offer",
              chatID,
              selfClientUUID: message.selfClientUUID,
              anotherClientUUID: clientUUID,
            }),
          );
          break;
        }

        case "self_local_offer": {
          console.info("self_local_offer");
          const peerConnection = peerConnections[message.anotherClientUUID];
          if (!peerConnection) break;

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          ws.send(
            JSON.stringify({
              type: "self_remote_offer",
              chatID,
              selfClientUUID: clientUUID,
              anotherClientUUID: message.anotherClientUUID,
              sessionDescription: peerConnection.localDescription,
            }),
          );
          break;
        }
        case "self_remote_offer": {
          console.info("self_remote_offer");
          const peerConnection = peerConnections[message.selfClientUUID];
          if (!peerConnection) break;

          await setRemoteDescription(message.sessionDescription, peerConnection);

          ws.send(
            JSON.stringify({
              type: "self_local_answer",
              chatID,
              selfClientUUID: message.selfClientUUID,
              anotherClientUUID: clientUUID,
            }),
          );
          break;
        }
        case "self_local_answer": {
          console.info("self_local_answer");
          const peerConnection = peerConnections[message.selfClientUUID];
          if (!peerConnection) break;

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          ws.send(
            JSON.stringify({
              type: "self_remote_answer",
              chatID,
              selfClientUUID: message.selfClientUUID,
              anotherClientUUID: clientUUID,
              sessionDescription: peerConnection.localDescription,
            }),
          );
          break;
        }
        case "self_remote_answer": {
          console.info("self_remote_answer");
          const peerConnection = peerConnections[message.anotherClientUUID];
          if (!peerConnection) break;

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
          const peerConnection = peerConnections[message.clientUUID];
          if (!peerConnection) break;

          const candidated = candidatedes[message.clientUUID];
          if (candidated) break;

          try {
            const candidate = new RTCIceCandidate(message.ice);
            await peerConnection.addIceCandidate(candidate);
            candidatedes[message.clientUUID] = true;
          } catch (error) {
            console.warn(error);
          }

          break;
        }
        case "close": {
          const peerConnection = peerConnections[message.clientUUID];
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

// WebRTCを利用する準備をする
const prepareNewConnection = (peerConnection: RTCPeerConnection) => {
  // リモートのMediStreamTrackを受信した時
  peerConnection.ontrack = async evt => {
    console.info("ontrack");
    const remoteVideoArea = document.getElementById("remoteVideoArea");
    if (!remoteVideoArea) return;

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
        videoElement.setAttribute("class", toolsP2PChatStyle.video);
        remoteVideoArea.appendChild(videoElement);
      }
      playVideo(videoElement, stream);
    });
  };

  // ICE Candidateを収集したときのイベント
  peerConnection.onicecandidate = evt => {
    console.info("onicecandidate");
    if (evt.candidate) {
      ws.send(
        JSON.stringify({
          type: "candidate",
          ice: evt.candidate,
          chatID,
          clientUUID,
        }),
      );
    }
  };

  // Offer側でネゴシエーションが必要になったときの処理
  peerConnection.onnegotiationneeded = async () => {
    console.info("onnegotiationneeded");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  };

  // ICEのステータスが変更になったときの処理
  // peerConnection.oniceconnectionstatechange = () => {
  //   console.info("oniceconnectionstatechange");
  //   switch (peerConnection.iceConnectionState) {
  //     case "closed":
  //       break;
  //     case "failed":
  //       if (peerConnection) {
  //         hangUp(peerConnection);
  //       }
  //       break;
  //     case "disconnected":
  //       break;
  //   }
  // };

  return peerConnection;
};

const createPeerConnection = async (targetUUID: string) => {
  const peerConnection = peerConnections[targetUUID];
  if (peerConnection) {
    peerConnection.close();
    delete peerConnections[targetUUID];
  }
  peerConnections[targetUUID] = prepareNewConnection(new RTCPeerConnection(rtcConfig));
};

const streamUpdate = (peerConnection: RTCPeerConnection) => {
  console.info("streamUpdate");
  // try {
  //   if (trackSender) peerConnection.removeTrack(trackSender);
  // } catch (error) {
  //   console.warn(error);
  // } finally {
  //   trackSender = null;
  // }

  if (selfVideoStream.now) {
    for (const track of selfVideoStream.now.getTracks()) {
      try {
        peerConnection.addTrack(track, selfVideoStream.now);
      } catch (error) {
        console.warn(error);
      }
    }
  }
};

export const changeSelfVideoStream = async (
  oldSelfVideoStream: MediaStream | null,
  newSelfVideoStream: MediaStream,
) => {
  if (oldSelfVideoStream && !selfVideoStream.old.includes(oldSelfVideoStream)) {
    selfVideoStream.old.push(oldSelfVideoStream);
  }
  selfVideoStream.now = newSelfVideoStream;

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
