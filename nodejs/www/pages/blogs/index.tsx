import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { checkLogin } from "@www/actions/common/login";
import Link from "next/link";

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
      </Head>
      <WrapperComponent {...state}>
        <ul>
          <li>
            <Link href="/blogs/qiita">
              <a>Qiita バックアップ</a>
            </Link>
            <ul>
              <li>
                <a href="https://qiita.com/igara" target="_blank" rel="noopener">
                  Qiita プロフィールページ
                </a>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/blogs/hatena">
              <a>Hatena バックアップ</a>
            </Link>
            <ul>
              <li>
                <a href="https://igara1119.hatenablog.com/" target="_blank" rel="noopener">
                  Hatena Blog
                </a>
              </li>
            </ul>
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
