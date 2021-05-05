import NextDocument, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends NextDocument {
  render() {
    const ga = `
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "${process.env.GOOGLE_TAG_MANAGER_ID}");
`;

    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_TAG_MANAGER_ID}`}
          ></script>
          <script dangerouslySetInnerHTML={{ __html: ga }}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
