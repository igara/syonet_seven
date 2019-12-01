import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next-redux-wrapper";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { checkLogin } from "@www/actions/common/login";

type Props = AppState;

const ToolsPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  if (process.browser) {
    db.transaction("rw", db.access_tokens, async () => {
      const accessTokens = await db.access_tokens.toArray();
      const token = accessTokens.length > 0 ? accessTokens[0].token : "";

      if (token) {
        await dispatch<any>(checkLogin.action(token));
      }
      setState(store.getState());
    });
  }

  return (
    <>
      <Head>
        <title>Syonet - Tools</title>
      </Head>
      <WrapperComponent {...state}>
        <ul>
          <li>
            <a href="/games/ssb" target="_blank" rel="noopener">
              SUPER SUPER BROS.
            </a>
            <ul>
              <li>
                <a href="/tools/ssb" target="_blank" rel="noopener">
                  チュートリアル
                </a>
              </li>
            </ul>
          </li>
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
