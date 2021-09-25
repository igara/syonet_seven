import { AppProps } from "next/app";
import React from "react";
import { wrapper } from "@www/stores";
import { ApolloProvider } from "react-apollo";
import apolloClient from "@www/libs/apollo/client";
import "@www/styles/global.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default wrapper.withRedux(App);
