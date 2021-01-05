import { WrapperComponent } from "@www/components/wrapper";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getJinsei } from "@www/actions/blogs/jinsei";
import { callJinsei } from "@www/libs/fetchs/github/jinsei";
import { wrapper, AppState } from "@www/stores";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@www/models/dexie/db";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "人生",
  path: "ogp/blogs/jinsei",
};

type Props = {
  jinsei?: string;
};

const BlogsJinseiPageComponent = (props: Props) => {
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
      await dispatch<any>(getJinsei.action());

      if (process.browser) {
        await loadCheckAuth();
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content="ブログ人生" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${encodeURI(ogp.title)}.png`} />
        <meta property="og:description" content="ブログ人生" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent>
        <div dangerouslySetInnerHTML={{ __html: props.jinsei ? props.jinsei : state.jinsei.jinsei.data.jinsei }}></div>
      </WrapperComponent>
    </>
  );
};

export default BlogsJinseiPageComponent;

export const getServerSideProps = wrapper.getServerSideProps(async () => {
  const jinsei = await callJinsei();

  await createOGPImage({
    path: ogp.path,
    title: ogp.title,
  });

  return {
    props: {
      jinsei,
    },
  };
});
