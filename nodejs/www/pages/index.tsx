/* eslint-disable no-undef */
import { NextPageContext } from "next";
import Head from "next/head";
import { WrapperComponent } from "@www/components/wrapper";
import { AppState } from "@www/stores";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { db } from "@www/models/dexie/db";
import { useDispatch, useStore } from "react-redux";
import { useState, useEffect } from "react";

type Props = {
  token: string;
} & AppState;

const IndexPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    if (process.browser) {
      (async () => {
        let token: string;
        if (props.token) {
          token = props.token;
          await db.access_tokens.clear();
          await db.access_tokens.put({
            token: token,
          });
        } else {
          const accessTokens = await db.access_tokens.toArray();
          token = accessTokens.length > 0 ? accessTokens[0].token : "";
        }

        if (token) {
          await dispatch<any>(checkLogin.action(token));
        }
        const storeState: AppState = store.getState();
        if (!storeState.login.login.data.user) {
          await db.access_tokens.clear();
        }
        setState(store.getState());
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Syonet</title>
        <meta content="五十嵐翔の個人サイト" name="description"></meta>
        <meta property="og:title" content="Syonet" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/index/ogp.png`} />
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
  return { ...state, token };
};

export default IndexPageComponent;
