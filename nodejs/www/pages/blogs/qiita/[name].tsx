import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getItem } from "@www/actions/blogs/qiita/item";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";

type Props = AppState;

const BlogsQiitaItemPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const storeState: AppState = store.getState();
  const router = useRouter();
  const name = process.browser ? decodeURI(location.href.split("/").reverse()[0]) : router.query.name;

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
      await dispatch<any>(getItem.action(name.toString()));

      if (process.browser) {
        await loadCheckAuth();
      }
      setState({
        ...storeState,
        ...state,
        qiitaItem: state.qiitaItem,
      });
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Syonet - Qiita - {name}</title>
        <meta content="Qiitaバックアップ" name="description"></meta>
        <meta property="og:title" content={`"Syonet - Qiita - ${name}"`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/blogs/qiita/ogp.png`} />
        <meta property="og:description" content="Qiitaバックアップ" />
      </Head>
      <WrapperComponent {...state}>
        <h1>{name}</h1>
        <div dangerouslySetInnerHTML={{ __html: state.qiitaItem.item.data.item }}></div>
      </WrapperComponent>
    </>
  );
};

BlogsQiitaItemPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const asPath = context.asPath || "";
  const name = process.browser ? decodeURI(asPath.split("/").reverse()[0]) : context.query.name;
  await context.store.dispatch<any>(getItem.action(encodeURI(name.toString())));
  const state: AppState = context.store.getState();
  return { ...state };
};

export default BlogsQiitaItemPageComponent;
