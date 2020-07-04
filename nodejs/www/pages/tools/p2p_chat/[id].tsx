import { WrapperComponent } from "@www/components/wrapper";
import toolsP2PChatStyle from "@www/styles/tools/p2p_chat.module.css";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";
import { ButtonComponent } from "@www/components/common/input/button";
import { playVideo, connectChat, closeSignaling, changeSelfVideoStream } from "@www/libs/webrtc/p2p_chat";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_CHAT_BY_ID_AND_PASSWORD, GetChatByIdAndPassword } from "@www/libs/apollo/gql/chat";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";

type Props = AppState;

const ToolsP2PChatIdPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const chatID = process.browser ? decodeURI(location.href.split("/").reverse()[0]).toString() : router.query.id.toString();

  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const [selfVideoFlag, setSelfVideoFlag] = useState(false);
  const [selfAudioFlag, setSelfAudioFlag] = useState(false);
  const [selfVideoStream, setSelfVideoStream] = useState<MediaStream|null>(null);

  const [initialized, setInitialized] = useState(false);

  const trackStop = (videoStream: MediaStream) => {
    videoStream.getVideoTracks().forEach((track) => {
      track.stop();
    });
    videoStream.getAudioTracks().forEach((track) => {
      track.stop();
    });
  };

  const changeSelfVideo = async(selfVideoElement: HTMLVideoElement | null, videoFlag: boolean, audioFlag: boolean) => {
    const userMedia = await navigator.mediaDevices.getUserMedia({ video: videoFlag, audio: audioFlag });
    if (selfVideoElement && userMedia) playVideo(selfVideoElement, userMedia);
    await changeSelfVideoStream(selfVideoStream, userMedia);
    setSelfVideoStream(userMedia);
  }

  const [chat, setChat] = useState<GetChatByIdAndPassword>();
  const [loadGetChatByIdAndPassword] = useLazyQuery<GetChatByIdAndPassword>(GET_CHAT_BY_ID_AND_PASSWORD, {
    onCompleted: (chatData) => {
      setChat(chatData);
    }
  });

  const [loadCheckAuth] = useLazyQuery<CheckAuth>(CHECK_AUTH, {
    onCompleted: async checkAuth => {
      if (!checkAuth.checkAuth) {
        await db.access_tokens.clear();
      } else {
        await dispatch(authActions.checkAuth(checkAuth.checkAuth));
        setState(store.getState());
      }
    },
  });

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const chatIndexDBData = await db.chats.where({ id: chatID }).first();
        if (!chatIndexDBData) {
          location.href = "/tools/p2p_chat";
          return;
        }

        await loadGetChatByIdAndPassword({
          variables: {
            id: Number(chatIndexDBData?.id),
            password: chatIndexDBData?.password
          }
        });

        if (!initialized) {
          connectChat(chatID);
          console.log("initialized");
          setInitialized(true);
        }

        await loadCheckAuth();

        setState(store.getState());

        return () => {
          closeSignaling();
        };
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>P2P Chat</title>
      </Head>
      <WrapperComponent {...state}>
        <div className={toolsP2PChatStyle.wrapper}>
          <h2>部屋の名前: {chat?.getChatByIdAndPassword.name}</h2>
          <h2>部屋ID: {chat?.getChatByIdAndPassword.id}</h2>
          <hr />
          <ButtonComponent OnClickHandler={async() => {
            if (selfVideoStream) {
              trackStop(selfVideoStream);
            }

            try {
              await changeSelfVideo(selfVideoRef.current, true, selfAudioFlag);
              setSelfVideoFlag(true);
            } catch (error) {
              console.error(error);
            }
          }} Abled={Boolean(selfVideoFlag)}>ビデオOn</ButtonComponent>
          <ButtonComponent OnClickHandler={async() => {
            if (!selfVideoStream) return;
            trackStop(selfVideoStream);
            setSelfVideoFlag(false);

            try {
              if (selfAudioFlag) {
                await changeSelfVideo(selfVideoRef.current, false, selfAudioFlag);
              }
            } catch (error) {
              console.error(error);
            }
          }} Abled={Boolean(!selfVideoFlag)}>ビデオOff</ButtonComponent>

          <ButtonComponent OnClickHandler={async() => {
            if (selfVideoStream) {
              trackStop(selfVideoStream);
            }

            try {
              await changeSelfVideo(selfVideoRef.current, selfVideoFlag, true);
              setSelfAudioFlag(true);
            } catch (error) {
              console.error(error);
            }
          }} Abled={Boolean(selfAudioFlag)}>マイクOn</ButtonComponent>
          <ButtonComponent OnClickHandler={async() => {
            if (!selfVideoStream) return;
            trackStop(selfVideoStream);
            setSelfAudioFlag(false);

            try {
              if (selfVideoFlag) {
                await changeSelfVideo(selfVideoRef.current, selfVideoFlag, false);
              }
            } catch (error) {
              console.error(error);
            }
          }} Abled={Boolean(!selfAudioFlag)}>マイクOff</ButtonComponent>
          <hr />
          <video ref={selfVideoRef} autoPlay={true} muted={true} playsInline={true} className={toolsP2PChatStyle.video} />
          <div id="remoteVideoArea" />
        </div>
      </WrapperComponent>
    </>
  );
};

ToolsP2PChatIdPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsP2PChatIdPageComponent;
