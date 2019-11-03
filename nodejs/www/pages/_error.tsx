import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next-redux-wrapper";
import { Cookies } from "@www/libs/cookie";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";

type Props = AppState;

const NotFoundPageComponent = (props: Props) => {
  return <WrapperComponent {...props}>存在しないページです</WrapperComponent>;
};

NotFoundPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
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

export default NotFoundPageComponent;
