import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
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
  const storeState: AppState = store.getState();

  useEffect(() => {
    (async () => {
      if (state.qiitaItems.items.data.items.length === 0) {
        await dispatch<any>(getItems.action());
      } else {
        await dispatch<any>(setItems.action(state.qiitaItems.items.data.items));
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
        <title>Syonet - Qiita</title>
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
