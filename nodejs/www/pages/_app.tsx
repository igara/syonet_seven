import { AppContext, AppProps } from "next/app";
import React from "react";
import makeStore, { AppState } from "@www/stores";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import { AnyAction } from "typescript-fsa";
import { Store } from "redux";

type Props = AppProps &
  AppContext & {
    store: Store<AppState, AnyAction>;
  };

class MyApp extends React.Component<Props> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default withRedux(makeStore)(MyApp);
