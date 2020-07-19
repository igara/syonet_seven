import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { getImages } from "@www/actions/blogs/speakerdeck/images";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  path: "static/ogp/blogs/speakerdeck/name",
};

type Props = AppState;

const BlogsSpeakerdeckDeskPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const storeState: AppState = store.getState();
  const router = useRouter();
  const name = process.browser
    ? decodeURI(location.href.split("/").reverse()[0]).toString()
    : router.query.name.toString();
  const [deckElementState, setDeckElementState] = useState(<div />);
  const SlideShow = dynamic(() => import("react-slideshow-ui"), { ssr: false });

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
    (async () => {
      await dispatch<any>(getImages.action(name.toString()));

      if (process.browser) {
        await loadCheckAuth();
      }
      setState({
        ...storeState,
        ...state,
        speakerdeckImages: state.speakerdeckImages,
      });

      state.speakerdeckImages.images.data.images.length === 0
        ? setDeckElementState(<div />)
        : setDeckElementState(
            <SlideShow
              style={{}}
              images={state.speakerdeckImages.images.data.images}
              withTimestamp={true}
              pageWillUpdate={(index, image) => {
                console.log(`Page Update! index: ${index}, image: ${image}`);
              }}
            />,
          );
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
      </Head>
      <WrapperComponent {...state}>
        <h1>{name}</h1>
        {deckElementState}
      </WrapperComponent>
    </>
  );
};

BlogsSpeakerdeckDeskPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const asPath = context.asPath || "";
  const name = process.browser ? decodeURI(asPath.split("/").reverse()[0]) : context.query.name;
  await context.store.dispatch<any>(getImages.action(encodeURI(name.toString())));
  const state: AppState = context.store.getState();

  if (context.isServer) {
    const requestPromise = (await import("request-promise")).default;
    const imageUri = encodeURI(state.speakerdeckImages.images.data.images[0]);

    const imageData = await requestPromise({
      url: imageUri,
      method: "GET",
      encoding: null,
    });

    await createOGPImage({
      path: ogp.path,
      title: name.toString(),
      image: imageData,
    });
  }

  return { ...state };
};

export default BlogsSpeakerdeckDeskPageComponent;
