import { WrapperComponent } from "@www/components/wrapper";
import { toolsSsbStyle } from "@www/styles";
import { NextPageContext } from "next";
import { AppProps } from "next-redux-wrapper";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";

type Props = AppState;

const ToolsSsbPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

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
        setState(storeState);
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Syonet - SUPER SUPER BROS.</title>
      </Head>
      <WrapperComponent {...state}>
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
    </>
  );
};

ToolsSsbPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsSsbPageComponent;
