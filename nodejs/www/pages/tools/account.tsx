import { WrapperComponent } from "@www/components/wrapper";
import toolsSsbStyle from "@www/styles/tools/ssb.module.css";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { spreadsheetList } from "@www/actions/tools/spreadsheet";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";

type Props = AppState;

const ToolsAccountPageComponent = (props: Props) => {
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
        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";

        if (token) {
          await loadCheckAuth();
          await dispatch<any>(spreadsheetList.action(token));
        }

        setState(store.getState());
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Syonet - 家計簿</title>
      </Head>
      <WrapperComponent {...state}>
        <div className={toolsSsbStyle.wrapper}>
          <h2>家計簿</h2>
        </div>
      </WrapperComponent>
    </>
  );
};

ToolsAccountPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsAccountPageComponent;
