import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getEntries, setEntries } from "@www/actions/blogs/hatena/entries";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { LinkComponent } from "@www/components/common/link";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "Hatena バックアップ",
  path: "static/ogp/blogs/hatena",
};

type Props = AppState;

const BlogsHatenaPageComponent = (props: Props) => {
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
    (async () => {
      if (state.hatenaEntries.entries.data.entries.length === 0) {
        await dispatch<any>(getEntries.action());
      } else {
        await dispatch<any>(setEntries.action(state.hatenaEntries.entries.data.entries));
      }

      if (process.browser) {
        await loadCheckAuth();
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
        <LinkComponent href="/blogs/hatena/[name]" as={`/blogs/hatena/${entry.name}`}>
          {entry.name}
        </LinkComponent>
      </li>
    );
  });

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content="Hatena バックアップ" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${ogp.title}.png`} />
        <meta property="og:description" content="Hatena バックアップ" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent {...state}>
        <h1>{ogp.title}</h1>
        <ul>{itemsElement}</ul>
      </WrapperComponent>
    </>
  );
};

BlogsHatenaPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  await context.store.dispatch<any>(getEntries.action());
  const state: AppState = context.store.getState();

  if (context.isServer) {
    await createOGPImage({
      path: ogp.path,
      title: ogp.title,
    });
  }

  return { ...state };
};

export default BlogsHatenaPageComponent;
