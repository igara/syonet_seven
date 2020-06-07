import { WrapperComponent } from "@www/components/wrapper";
import { toolsSFUChatStyle } from "@www/styles";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";
import { getSFUChat } from "@www/actions/tools/sfu_chat";
import { initializeChat, startMedia, stopMedia, connect, disconnect } from "@www/libs/webrtc/sfu_chat";

type Props = AppState;

const ToolsSFUChatIdPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const chatID = process.browser ? decodeURI(location.href.split("/").reverse()[0]).toString() : router.query.id.toString();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const chat = await db.chats.where({ id: chatID }).first();
        if (!chat) {
          location.href = "/tools/sfu_chat";
          return;
        }

        await dispatch(getSFUChat({ id: chat?.id, password: chat?.password }));

        if (!initialized) {
          initializeChat();
          console.log("initialized");
          setInitialized(true);
        }

        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";

        await dispatch<any>(checkLogin.action(token));

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
        <title>Syonet - SFU Chat</title>
      </Head>
      <WrapperComponent {...state}>
        <div className={toolsSFUChatStyle.wrapper}>
          <h2>部屋の名前: {state.sfuChat.chat.data.chat.name}</h2>
          <h2>部屋ID: {state.sfuChat.chat.data.chat._id}</h2>
          <hr />
          <input type="checkbox" id="use_video" />video
          <input type="checkbox" id="use_audio" />audio
          <button id="start_video_button" onClick={startMedia}>Start Media</button>
          <button id="stop_video_button" onClick={stopMedia}>Stop Media</button>
          &nbsp;
          <input type="text" id="room_name" placeholder="room name" />
          <button id="connect_button" onClick={connect}>Connect</button>
          <button id="disconnect_button" onClick={disconnect}>Disconnect</button>
          <div>
            local video<br />
            <video id="local_video" autoPlay={true} style={{width: "120px", height: "90px", border: "1px solid black"}}></video>
            <span id="state_span"></span>
          </div>
          remote video<br />
          <div id="remote_container"></div>
        </div>
      </WrapperComponent>
    </>
  );
};

ToolsSFUChatIdPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsSFUChatIdPageComponent;
