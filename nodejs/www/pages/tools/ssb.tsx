import { WrapperComponent } from "@www/components/wrapper";
import { toolsSsbStyle } from "@www/styles";
import { NextPageContext } from "next";
import { AppProps } from "next-redux-wrapper";
import { Cookies } from "@www/libs/cookie";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";

type Props = AppState;

const ToolsSsbPageComponent = (props: Props) => {
  return (
    <WrapperComponent {...props}>
      <div className={toolsSsbStyle.wrapper}>
        <h2>SUPER SUPER BROS.</h2>
        <h3>ルール説明</h3>
        <ol>
          <li>
            好きなキャラクターを選択しよう！
            <br />
            対戦相手がいない場合はCPUとバトルできるぞ！
          </li>
          <li>バトルを始めるとsyonetのDiscordやブラウザの通知を許可するとプレイヤーの参加状態が通知されるぞ！</li>
          <li>「←」「→」 キャラクターを移動することができるぞ！</li>
          <li>「A」 で攻撃ができるぞ！</li>
          <li>
            攻撃を受けすぎるとふっとびやすくなるぞ！
            <br />
            気をつけろ
          </li>
          <li>
            ふっとばしてテキを落とせ！
            <br />
            自分は落とされるな
          </li>
          <li>落とされそうになったら 「↑」でジャンプしてステージに復帰するんだ</li>
          <li>ちなみにプレイヤーは何人でも参加して遊べるぞ</li>
        </ol>
        <h3>キー操作</h3>
        <ul>
          <li>
            「←」「→」
            <br />
            キャラクター移動
          </li>
          <li>
            「↑」
            <br />
            ジャンプ
          </li>
          <li>
            「A」
            <br />
            攻撃
          </li>
        </ul>
        <h3>ゲームスタート</h3>
        <a href="/games/ssb" target="_blank" rel="noopener">
          SUPER SUPER BROS.
        </a>
      </div>
    </WrapperComponent>
  );
};

ToolsSsbPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
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

export default ToolsSsbPageComponent;
