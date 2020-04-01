import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { getEntry } from "@www/actions/blogs/hatena/entry";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";

type Props = AppState;

const BlogsHatenaEntryPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const storeState: AppState = store.getState();
  const router = useRouter();
  const name = process.browser ? decodeURI(location.href.split("/").reverse()[0]) : router.query.name;

  useEffect(() => {
    (async () => {
      await dispatch<any>(getEntry.action(name.toString()));

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
        ...storeState,
        ...state,
        hatenaEntry: state.hatenaEntry,
      });
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Syonet - Hatena - {name}</title>
      </Head>
      <WrapperComponent {...state}>
        <h1>{name}</h1>
        <div dangerouslySetInnerHTML={{ __html: state.hatenaEntry.entry.data.entry }}></div>
      </WrapperComponent>
    </>
  );
};

BlogsHatenaEntryPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const asPath = context.asPath || "";
  const name = process.browser ? decodeURI(asPath.split("/").reverse()[0]) : context.query.name;
  await context.store.dispatch<any>(getEntry.action(encodeURI(name.toString())));
  const state: AppState = context.store.getState();
  return { ...state };
};

export default BlogsHatenaEntryPageComponent;
