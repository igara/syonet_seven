import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getItems, setItems } from "@www/actions/blogs/qiita/items";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { LinkComponent } from "@www/components/common/link";

type Props = AppState;

const BlogsQiitaPageComponent = (props: Props) => {
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
      if (state.qiitaItems.items.data.items.length === 0) {
        await dispatch<any>(getItems.action());
      } else {
        await dispatch<any>(setItems.action(state.qiitaItems.items.data.items));
      }

      if (process.browser) {
        await loadCheckAuth();
      }

      setState({
        ...store.getState(),
        qiitaItems: state.qiitaItems,
      });
    })();
  }, []);

  const itemsElement = state.qiitaItems.items.data.items.map(item => {
    return (
      <li key={item.sha}>
        <LinkComponent href="/blogs/qiita/[name]" as={`/blogs/qiita/${item.name}`}>
          {item.name}
        </LinkComponent>
      </li>
    );
  });

  return (
    <>
      <Head>
        <title>Qiita</title>
        <meta content="Qiitaバックアップ" name="description"></meta>
        <meta property="og:title" content="Qiita" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/blogs/qiita/ogp.png`} />
        <meta property="og:description" content="Qiitaバックアップ" />
      </Head>
      <WrapperComponent {...state}>
        <h1>Qiita バックアップ</h1>
        <ul>{itemsElement}</ul>
      </WrapperComponent>
    </>
  );
};

BlogsQiitaPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  await context.store.dispatch<any>(getItems.action());
  const state: AppState = context.store.getState();
  return { ...state };
};

export default BlogsQiitaPageComponent;
