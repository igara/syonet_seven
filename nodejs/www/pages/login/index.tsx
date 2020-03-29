import Head from "next/head";
import { WrapperComponent } from "@www/components/wrapper";
import { ButtonComponent as Button } from "@www/components/common/input/button";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";

type Props = AppState;

const LoginPageComponent = (props: Props) => {
  const host = process.env.WWW_HOST;
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
        <title>Syonet - Login</title>
      </Head>
      <WrapperComponent {...state}>
        ログイン画面です
        <Button>
          <a href={`${host}/auth/google`}>Google</a>
        </Button>
        <Button>
          <a href={`${host}/auth/facebook`}>Facebook</a>
        </Button>
        <Button>
          <a href={`${host}/auth/github`}>GitHub</a>
        </Button>
      </WrapperComponent>
    </>
  );
};

LoginPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default LoginPageComponent;
