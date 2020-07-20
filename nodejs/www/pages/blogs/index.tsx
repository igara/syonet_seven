import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { LinkComponent } from "@www/components/common/link";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "Blogs",
  path: "static/ogp/blogs",
};

type Props = AppState;

const BlogsPageComponent = (props: Props) => {
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
        await loadCheckAuth();

        setState(store.getState());
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content="ブログたち" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${ogp.title}.png`} />
        <meta property="og:description" content="ブログたち" />
        <meta name="twitter:card" content="summary_large_image" />
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

  if (context.isServer) {
    await createOGPImage({
      path: ogp.path,
      title: ogp.title,
    });
  }

  return { ...state };
};

export default BlogsPageComponent;
