import { WrapperComponent } from "@www/components/wrapper";
import { toolsChatStyle } from "@www/styles";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";
// import { TextComponent } from "@www/components/common/input/text";
import { ButtonComponent } from "@www/components/common/input/button";
import { getChat } from "@www/actions/tools/chat";
import { playVideo, connectSignaling, connectWebRTC } from "@www/libs/webrtc/chat";

type Props = AppState;

const ToolsChatIdPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const chatID = process.browser ? decodeURI(location.href.split("/").reverse()[0]) : router.query.id;

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

  if (process.browser && !initialized) {
    connectSignaling();
    setInitialized(true);
  }

  const changeSelfVideo = async(selfVideoElement: HTMLVideoElement | null, videoFlag: boolean, audioFlag: boolean) => {
    const userMedia = await navigator.mediaDevices.getUserMedia({ video: videoFlag, audio: audioFlag });
    setSelfVideoStream(userMedia);
    connectWebRTC(userMedia);
    if (selfVideoElement && userMedia) playVideo(selfVideoElement, userMedia);
  }

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";

        await dispatch<any>(checkLogin.action(token));

        const chat = await db.chats.where({ id: chatID }).first();
        if (!chat) {
          location.href = "/tools/chat";
          return;
        }

        await dispatch(getChat({ id: chat?.id, password: chat?.password }));

        const storeState: AppState = store.getState();

        if (!storeState.login.login.data.user) {
          await db.access_tokens.clear();
        }
        setState(storeState);
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Syonet - Chat</title>
      </Head>
      <WrapperComponent {...state}>
        <div className={toolsChatStyle.wrapper}>
          <h2>Chat: {state.chat.chat.data.chat.name}</h2>
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
          <video ref={selfVideoRef} autoPlay={true} controls={true} className={toolsChatStyle.video} />
        </div>
      </WrapperComponent>
    </>
  );
};

ToolsChatIdPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsChatIdPageComponent;
