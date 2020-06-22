import Head from "next/head";
import { WrapperComponent } from "@www/components/wrapper";
import { ButtonComponent as Button } from "@www/components/common/input/button";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
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
        <title>Syonet - Login</title>
        <meta content="ログインページ" name="description"></meta>
        <meta property="og:title" content="Syonet - Login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/login/ogp.png`} />
        <meta property="og:description" content="ログインページ" />
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
