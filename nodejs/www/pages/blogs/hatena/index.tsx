import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { getEntries, setEntries } from "@www/actions/blogs/hatena/entries";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import Link from "next/link";

type Props = AppState;

const BlogsHatenaPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const storeState: AppState = store.getState();

  useEffect(() => {
    (async () => {
      if (state.hatenaEntries.entries.data.entries.length === 0) {
        await dispatch<any>(getEntries.action());
      } else {
        await dispatch<any>(setEntries.action(state.hatenaEntries.entries.data.entries));
      }

      if (process.browser) {
        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";

        if (token) {
          await dispatch<any>(checkLogin.action(token));
        }

        if (!storeState.login.login.data.user) {
          await db.access_tokens.clear();
        }
      }

      setState({
        ...store.getState(),
        hatenaEntries: state.hatenaEntries,
      });
    })();
  }, []);

  const itemsElement = state.hatenaEntries.entries.data.entries.map(entry => {
    return (
      <li key={entry.sha}>
        <Link href="/blogs/hatena/[name]" as={`/blogs/hatena/${entry.name}`}>
          <a>{entry.name}</a>
        </Link>
      </li>
    );
  });

  return (
    <>
      <Head>
        <title>Syonet - Hatena</title>
      </Head>
      <WrapperComponent {...state}>
        <h1>Hatena バックアップ</h1>
        <ul>{itemsElement}</ul>
      </WrapperComponent>
    </>
  );
};

BlogsHatenaPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  await context.store.dispatch<any>(getEntries.action());
  const state: AppState = context.store.getState();
  return { ...state };
};

export default BlogsHatenaPageComponent;
