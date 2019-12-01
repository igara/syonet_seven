import Document, { Head, Main, NextScript, DocumentContext } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

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
      <html>
        <Head>
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <script async src="/notification.js"></script>
          <script async src="/sw_register.js"></script>
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
      </html>
    );
  }
}
