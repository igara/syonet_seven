import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { getImages } from "@www/actions/blogs/speakerdeck/images";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

type Props = AppState;

const BlogsSpeakerdeckDeskPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const storeState: AppState = store.getState();
  const router = useRouter();
  const name = process.browser ? decodeURI(location.href.split("/").reverse()[0]) : router.query.name;
  const [deckElementState, setDeckElementState] = useState(<div />);
  const SlideShow = dynamic(() => import("react-slideshow-ui"), { ssr: false });

  useEffect(() => {
    (async () => {
      await dispatch<any>(getImages.action(name.toString()));

      if (process.browser) {
        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";

        if (token) {
          await dispatch<any>(checkLogin.action(token));
        }

        if (!storeState.login.login.data.user) {
          await db.access_tokens.clear();
        }
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
        <title>Syonet - Speaker Deck - {name}</title>
        <meta content="Speaker Deckバックアップ" name="description"></meta>
        <meta property="og:title" content={`"Syonet - Speaker Deck - ${name}"`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/blogs/speakerdeck/ogp.png`} />
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
  return { ...state };
};

export default BlogsSpeakerdeckDeskPageComponent;
