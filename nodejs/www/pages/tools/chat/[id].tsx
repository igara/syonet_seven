import { WrapperComponent } from "@www/components/wrapper";
import { toolsChatStyle } from "@www/styles";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import Router from "next/router";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";
// import { TextComponent } from "@www/components/common/input/text";
// import { ButtonComponent } from "@www/components/common/input/button";
import { getChat } from "@www/actions/tools/chat";
// import { LinkComponent } from "@www/components/common/link";

type Props = AppState;

const ToolsChatIdPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const chatID = process.browser ? decodeURI(location.href.split("/").reverse()[0]) : router.query.id;

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";
        const chat = await db.chats.where({ id: chatID }).first();

        await dispatch<any>(checkLogin.action(token));

        const storeState: AppState = store.getState();
        if (!storeState.login.login.data.user || !chat) {
          await db.access_tokens.clear();
          Router.push("/tools/chat");
          return;
        }

        await dispatch(getChat({ id: chat?.id, password: chat?.password }));

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
