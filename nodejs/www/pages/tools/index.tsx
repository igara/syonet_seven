import { WrapperComponent } from "@www/components/wrapper";
import { wrapper } from "@www/stores";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { db } from "@www/models/dexie/db";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { LinkComponent } from "@www/components/common/link";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "Tools",
  path: "ogp/tools",
};

const ToolsPageComponent = () => {
  const dispatch = useDispatch();
  const [loadCheckAuth] = useLazyQuery<CheckAuth>(CHECK_AUTH, {
    onCompleted: async checkAuth => {
      if (!checkAuth.checkAuth) {
        await db.access_tokens.clear();
      } else {
        await dispatch(authActions.checkAuth(checkAuth.checkAuth));
      }
    },
  });

  useEffect(() => {
    if (process.browser) {
      (async () => {
        await loadCheckAuth();
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content="Toolたち" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${encodeURI(ogp.title)}.png`} />
        <meta property="og:description" content="Toolたち" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent>
        <ul>
          <li>
            <a href="/games/ssb" target="_blank" rel="noopener">
              SUPER SUPER BROS.
            </a>
            <ul>
              <li>
                <LinkComponent href="/tools/ssb">チュートリアル</LinkComponent>
              </li>
            </ul>
          </li>
          <li>
            <LinkComponent href="/tools/scraping">Web魚拓っぽい</LinkComponent>
          </li>
          <li>
            <LinkComponent href="/tools/vrm">VRM Reader</LinkComponent>
          </li>
          <li>
            <LinkComponent href="/tools/sound">音楽検索</LinkComponent>
          </li>
          <li>
            <LinkComponent href="/tools/speech">Speech To Text</LinkComponent>
          </li>
        </ul>
      </WrapperComponent>
    </>
  );
};

export default ToolsPageComponent;

export const getServerSideProps = wrapper.getServerSideProps(async () => {
  await createOGPImage({
    path: ogp.path,
    title: ogp.title,
  });

  return {
    props: {},
  };
});
