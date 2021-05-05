import { WrapperComponent } from "@www/components/wrapper";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getImages } from "@www/actions/blogs/speakerdeck/images";
import { AppState, wrapper } from "@www/stores";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { createOGPImage } from "@www/libs/ogp_image";
import { requestWebpush } from "@www/libs/apollo/gql/webpush";

const ogp = {
  path: "ogp/blogs/speakerdeck/name",
};

const BlogsSpeakerdeckDeskPageComponent = () => {
  const state = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const router = useRouter();
  let name = process.browser
    ? decodeURI(location.href.split("/").reverse()[0]).toString()
    : router.query.name;
  name = name ? name.toString() : "";
  const SlideShow = dynamic(() => import("react-slideshow-ui"), { ssr: false });

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
      if (state.speakerdeckImages.images.data.images.length === 0) {
        await dispatch<any>(getImages.action(name?.toString()));
      }

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
        <meta content="Speaker Deckバックアップ" name="description"></meta>
        <meta property="og:title" content={name} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${name}.png`} />
        <meta property="og:description" content="Speaker Deckバックアップ" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent>
        <h1>{name}</h1>
        <SlideShow
          style={{}}
          images={state.speakerdeckImages.images.data.images}
          withTimestamp={true}
          pageWillUpdate={(index, image) => {
            console.log(`Page Update! index: ${index}, image: ${image}`);
          }}
        />
      </WrapperComponent>
    </>
  );
};

export default BlogsSpeakerdeckDeskPageComponent;

export const getServerSideProps = wrapper.getServerSideProps(async context => {
  let name = context.query.name;
  name = name ? name.toString() : "";
  await context.store.dispatch<any>(getImages.action(encodeURI(name)));
  const state: AppState = context.store.getState();

  const requestPromise = (await import("request-promise")).default;
  const imageUri = encodeURI(state.speakerdeckImages.images.data.images[0]);

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
