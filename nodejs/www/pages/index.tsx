import { NextPageContext } from "next";
import Head from "next/head";
import { WrapperComponent } from "@www/components/wrapper";
import { AppState } from "@www/stores";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { db } from "@www/models/dexie/db";
import { useDispatch, useStore } from "react-redux";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "Syonetトップページ",
  path: "static/ogp/index",
};

type Props = {
  token: string;
} & AppState;

const IndexPageComponent = (props: Props) => {
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
        if (props.token) {
          await db.access_tokens.clear();
          await db.access_tokens.put({
            token: props.token,
          });
        }

        await loadCheckAuth();

        setState(store.getState());
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content="五十嵐翔の個人サイト" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${ogp.title}.png`} />
        <meta property="og:description" content="五十嵐翔の個人サイト" />
      </Head>
      <WrapperComponent {...state}>
        なんとなくdiscordはじめてみました。ChatOps的な何かとかやってます。ご自由にご参加ください。
        <iframe
          src="https://discordapp.com/widget?id=426647501643317252&theme=light&username=anonimas"
          width="100%"
          height={300}
          frameBorder={0}
        />
        またこのページはオフラインでも見れます。たまに左下の三表示からキャッシュを削除してご利用ください。
      </WrapperComponent>
    </>
  );
};

IndexPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const token = context.query.token;
  const state: AppState = context.store.getState();

  if (context.isServer) {
    await createOGPImage({
      path: ogp.path,
      title: ogp.title,
    });
  }

  return { ...state, token };
};

export default IndexPageComponent;
