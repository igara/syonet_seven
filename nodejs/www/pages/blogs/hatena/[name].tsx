import { WrapperComponent } from "@www/components/wrapper";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getEntry } from "@www/actions/blogs/hatena/entry";
import { AppState, wrapper } from "@www/stores";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";
import { createOGPImage } from "@www/libs/ogp_image";
import { requestWebpush } from "@www/libs/apollo/gql/webpush";

const ogp = {
  path: "ogp/blogs/hatena/name",
};

const BlogsHatenaEntryPageComponent = () => {
  const state = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const router = useRouter();
  let name = process.browser
    ? decodeURI(location.href.split("/").reverse()[0]).toString()
    : router.query.name;
  name = name ? name.toString() : "";

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
      await dispatch<any>(getEntry.action(name?.toString()));

      if (process.browser) {
        await requestWebpush();
        await loadCheckAuth();
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta content="Hatena バックアップ" name="description"></meta>
        <meta property="og:title" content={name} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${name}.png`} />
        <meta property="og:description" content="Hatena バックアップ" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent>
        <h1>{name}</h1>
        <div dangerouslySetInnerHTML={{ __html: state.hatenaEntry.entry.data.entry }}></div>
      </WrapperComponent>
    </>
  );
};

export default BlogsHatenaEntryPageComponent;

export const getServerSideProps = wrapper.getServerSideProps(async context => {
  let name = context.query.name;
  name = name ? name.toString() : "";
  await context.store.dispatch<any>(getEntry.action(encodeURI(name)));
  const state: AppState = context.store.getState();

  const requestPromise = (await import("request-promise")).default;
  const imgTags = state.hatenaEntry.entry.data.entry.match(/(<img ([^>]+)>)/gi);
  const imgTag = imgTags instanceof Array && imgTags.length > 0 ? imgTags[0].replace(/\n/, "") : "";
  const imageUris = imgTag.match(/http.*"/gi);
  const imageUri =
    imageUris instanceof Array && imageUris.length > 0 ? encodeURI(imageUris[0].replace(/".*/, "")) : "";

  let imageData;
  if (imageUri) {
    imageData = await requestPromise({
      url: imageUri,
      method: "GET",
      encoding: null,
    });
  }

  await createOGPImage({
    path: ogp.path,
    title: name,
    image: imageData,
  });

  return {
    props: {},
  };
});
