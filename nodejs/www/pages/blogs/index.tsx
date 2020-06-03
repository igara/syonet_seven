import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { checkLogin } from "@www/actions/common/login";
import { LinkComponent } from "@www/components/common/link";

type Props = AppState;

const BlogsPageComponent = (props: Props) => {
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
        <title>Syonet - Blogs</title>
        <meta content="ブログたち" name="description"></meta>
        <meta property="og:title" content="Syonet - Blogs" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/blogs/index/ogp.png`} />
        <meta property="og:description" content="ブログたち" />
      </Head>
      <WrapperComponent {...state}>
        <ul>
          <li>
            <LinkComponent href="/blogs/qiita">Qiita バックアップ</LinkComponent>
            <ul>
              <li>
                <a href="https://qiita.com/igara" target="_blank" rel="noopener">
                  Qiita プロフィールページ
                </a>
              </li>
            </ul>
          </li>
          <li>
            <LinkComponent href="/blogs/hatena">Hatena Blog バックアップ</LinkComponent>
            <ul>
              <li>
                <a href="https://igara1119.hatenablog.com/" target="_blank" rel="noopener">
                  Hatena Blog
                </a>
              </li>
            </ul>
          </li>
          <li>
            <LinkComponent href="/blogs/speakerdeck">Speaker Deck バックアップ</LinkComponent>
            <ul>
              <li>
                <a href="https://speakerdeck.com/igara" target="_blank" rel="noopener">
                  Speaker Deck
                </a>
              </li>
            </ul>
          </li>
          <li>
            <LinkComponent href="/blogs/jinsei">人生</LinkComponent>
          </li>
        </ul>
      </WrapperComponent>
    </>
  );
};

BlogsPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default BlogsPageComponent;
