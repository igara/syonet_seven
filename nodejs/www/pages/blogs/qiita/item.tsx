import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next-redux-wrapper";
import { checkLogin } from "@www/actions/common/login";
import { getItems, setItems } from "@www/actions/blogs/qiita";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";

type Props = AppState;

const BlogsQiitaItemPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  if (state.qiitaItems.items.data.items.length === 0) {
    dispatch<any>(getItems.action());
  } else {
    dispatch<any>(setItems.action(state.qiitaItems.items.data.items));
  }

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
        setState({
          ...storeState,
          qiitaItems: state.qiitaItems,
        });
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Syonet - Qiita</title>
      </Head>
      <WrapperComponent {...state}>
        <h1>Qiita バックアップ</h1>
      </WrapperComponent>
    </>
  );
};

BlogsQiitaItemPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  await context.store.dispatch<any>(getItems.action());
  const state: AppState = context.store.getState();
  return { ...state };
};

export default BlogsQiitaItemPageComponent;
