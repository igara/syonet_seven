import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { checkLogin } from "@www/actions/common/login";
import { LinkComponent } from "@www/components/common/link";

type Props = AppState;

const ToolsPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";

        if (token) {
          await dispatch<any>(checkLogin.action(token));
        }

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
        <title>Syonet - Tools</title>
        <meta content="Toolたち" name="description"></meta>
        <meta property="og:title" content="Syonet - Tools" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/tools/index/ogp.png`} />
        <meta property="og:description" content="Toolたち" />
      </Head>
      <WrapperComponent {...state}>
        <ul>
          <li>
            <a href="/games/ssb" target="_blank" rel="noopener">
              SUPER SUPER BROS.
            </a>
            <ul>
              <li>
                <LinkComponent href="/tools/ssb">チュートリアル</LinkComponent>
              </li>
            </ul>
          </li>
          <li>
            <LinkComponent href="/tools/chat">チャット</LinkComponent>
          </li>
          <li>
            <LinkComponent href="/tools/p2p_chat">P2Pチャット</LinkComponent>
          </li>
          <li>
            <LinkComponent href="/tools/sfu_chat">SFUチャット</LinkComponent>
          </li>
          {/* <li>
            <LinkComponent href="/tools/account">家計簿</LinkComponent>
          </li> */}
        </ul>
      </WrapperComponent>
    </>
  );
};

ToolsPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsPageComponent;
