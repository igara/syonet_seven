import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { getJinsei } from "@www/actions/blogs/jinsei";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";

type Props = AppState;

const BlogsJinseiPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const storeState: AppState = store.getState();

  useEffect(() => {
    (async () => {
      await dispatch<any>(getJinsei.action());

      if (process.browser) {
        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";

        if (token) {
          await dispatch<any>(checkLogin.action(token));
        }

        if (!storeState.login.login.data.user) {
          await db.access_tokens.clear();
        }
      }
      setState({
        ...storeState,
        ...state,
        qiitaItem: state.qiitaItem,
      });
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Syonet - 人生 -</title>
      </Head>
      <WrapperComponent {...state}>
        <div dangerouslySetInnerHTML={{ __html: state.jinsei.jinsei.data.jinsei }}></div>
      </WrapperComponent>
    </>
  );
};

BlogsJinseiPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  await context.store.dispatch<any>(getJinsei.action());
  const state: AppState = context.store.getState();
  return { ...state };
};

export default BlogsJinseiPageComponent;
