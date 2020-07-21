import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getJinsei } from "@www/actions/blogs/jinsei";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "人生",
  path: "ogp/blogs/jinsei",
};

type Props = AppState;

const BlogsJinseiPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const storeState: AppState = store.getState();

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
    (async () => {
      await dispatch<any>(getJinsei.action());

      if (process.browser) {
        await loadCheckAuth();
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
        <title>{ogp.title}</title>
        <meta content="ブログ人生" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${encodeURI(ogp.title)}.png`} />
        <meta property="og:description" content="ブログ人生" />
        <meta name="twitter:card" content="summary_large_image" />
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

  if (context.isServer) {
    await createOGPImage({
      path: ogp.path,
      title: ogp.title,
    });
  }

  return { ...state };
};

export default BlogsJinseiPageComponent;
