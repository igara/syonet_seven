import { WrapperComponent } from "@www/components/wrapper";
import toolsSsbStyle from "@www/styles/tools/ssb.module.css";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { wrapper } from "@www/stores";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { db } from "@www/models/dexie/db";
import { createOGPImage } from "@www/libs/ogp_image";
import { requestWebpush } from "@www/libs/apollo/gql/webpush";

const ogp = {
  title: "SUPER SUPER BROS.",
  path: "ogp/tools/ssb",
};

const ToolsSsbPageComponent = () => {
  const dispatch = useDispatch();
  const [loadCheckAuth] = useLazyQuery<CheckAuth>(CHECK_AUTH, {
    onCompleted: async checkAuth => {
      if (!checkAuth.checkAuth) {
        await db.access_tokens.clear();
      } else {
        await dispatch(authActions.checkAuth(checkAuth.checkAuth));
      }
    },
  });

  useEffect(() => {
    if (process.browser) {
      (async () => {
        await requestWebpush();
        await loadCheckAuth();
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content="パクリゲー" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${ogp.title}.png`} />
        <meta property="og:description" content="パクリゲー" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent>
        <div className={toolsSsbStyle.wrapper}>
          <h2>{ogp.title}</h2>
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

export default ToolsSsbPageComponent;

export const getServerSideProps = wrapper.getServerSideProps(async () => {
  await createOGPImage({
    path: ogp.path,
    title: ogp.title,
  });

  return {
    props: {},
  };
});
