import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { LinkComponent } from "@www/components/common/link";

type Props = AppState;

const ToolsPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
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
        await loadCheckAuth();
        setState(store.getState());
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
            <LinkComponent href="/tools/p2p_chat">P2Pチャット</LinkComponent>
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
