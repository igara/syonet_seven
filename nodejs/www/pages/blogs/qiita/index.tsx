import { WrapperComponent } from "@www/components/wrapper";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getItems } from "@www/actions/blogs/qiita/items";
import { AppState, wrapper } from "@www/stores";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@www/models/dexie/db";
import { LinkComponent } from "@www/components/common/link";
// import { createOGPImage } from "@www/libs/ogp_image";
import { requestWebpush } from "@www/libs/apollo/gql/webpush";

const ogp = {
  title: "Qiita バックアップ",
  path: "ogp/blogs/qiita",
};

const BlogsQiitaPageComponent = () => {
  const state = useSelector((state: AppState) => state);
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
    (async () => {
      if (state.qiitaItems.items.data.items.length === 0) {
        await dispatch<any>(getItems.action());
      }

      if (process.browser) {
        await requestWebpush();
        await loadCheckAuth();
      }
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
        <title>{ogp.title}</title>
        <meta content="Qiita バックアップ" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${ogp.title}.png`} />
        <meta property="og:description" content="Qiita バックアップ" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent>
        <h1>{ogp.title}</h1>
        <ul>{itemsElement}</ul>
      </WrapperComponent>
    </>
  );
};

export default BlogsQiitaPageComponent;

export const getServerSideProps = wrapper.getServerSideProps(async context => {
  await context.store.dispatch<any>(getItems.action());

  // await createOGPImage({
  //   path: ogp.path,
  //   title: ogp.title,
  // });

  return {
    props: {},
  };
});
