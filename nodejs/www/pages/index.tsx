/* eslint-disable no-undef */
import { NextPageContext } from "next";
import Head from "next/head";
import { Cookies } from "@www/libs/cookie";
import { WrapperComponent } from "@www/components/wrapper";
import { AppState } from "@www/stores";
import { AppProps } from "next-redux-wrapper";
import { checkLogin } from "@www/actions/common/login";

type Props = AppState;

const IndexPageComponent = (props: Props) => {
  return (
    <>
      <Head>
        <title>Syonet</title>
      </Head>
      <WrapperComponent {...props}>
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
  try {
    const cookie = context.req ? Cookies(context.req) : Cookies();
    const sessionId = cookie.get("connect.sid");
    if (sessionId) {
      const token = `connect.sid=${sessionId}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await context.store.dispatch<any>(checkLogin.action(token));
    }
  } catch (error) {
    console.error(error);
  }
  const state: AppState = context.store.getState();
  return { ...state };
};

export default IndexPageComponent;
