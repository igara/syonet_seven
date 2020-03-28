import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { checkLogin } from "@www/actions/common/login";
import Link from "next/link";

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
      </Head>
      <WrapperComponent {...state}>
        <ul>
          <li>
            <a href="/games/ssb" target="_blank" rel="noopener">
              SUPER SUPER BROS.
            </a>
            <ul>
              <li>
                <Link href="/tools/ssb">
                  <a>チュートリアル</a>
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/tools/account">
              <a>家計簿</a>
            </Link>
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
