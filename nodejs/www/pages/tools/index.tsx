import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next-redux-wrapper";
import { checkLogin } from "@www/actions/common/login";
import { Cookies } from "@www/libs/cookie";
import { AppState } from "@www/stores";

type Props = AppState;

const ToolsPageComponent = (props: Props) => {
  return (
    <WrapperComponent {...props}>
      <ul>
        <li>
          <a href="/games/ssb" target="_blank" rel="noopener">
            SUPER SUPER BROS.
          </a>
          <ul>
            <li>
              <a href="/tools/ssb" target="_blank" rel="noopener">
                チュートリアル
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </WrapperComponent>
  );
};

ToolsPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
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

export default ToolsPageComponent;
