import Head from "next/head";
import { WrapperComponent } from "@www/components/wrapper";
import { ButtonComponent as Button } from "@www/components/common/input/button";
import { NextPageContext } from "next";
import { Cookies } from "@www/libs/cookie";
import { AppProps } from "next-redux-wrapper";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";

type Props = AppState;

const LoginPageComponent = (props: Props) => {
  const host = process.env.WWW_HOST;
  return (
    <>
      <Head>
        <title>Syonet - Login</title>
        <link rel="shortcut icon" href="/static/favicon.ico" />
      </Head>
      <WrapperComponent {...props}>
        ログイン画面です
        <Button>
          <a href={`${host}/auth/google`}>Google</a>
        </Button>
        <Button>
          <a href={`${host}/auth/facebook`}>facebook</a>
        </Button>
        <Button>
          <a href={`${host}/auth/twitter`}>twitter</a>
        </Button>
        <Button>
          <a href={`${host}/auth/github`}>github</a>
        </Button>
      </WrapperComponent>
    </>
  );
};

LoginPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
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
  return { ...context.store.getState() };
};

export default LoginPageComponent;
