import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { getDecks, setDecks } from "@www/actions/blogs/speakerdeck/decks";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { LinkComponent } from "@www/components/common/link";

type Props = AppState;

const BlogsSpeakerdeckPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const storeState: AppState = store.getState();

  useEffect(() => {
    (async () => {
      if (state.speakerdeckDesks.decks.data.decks.length === 0) {
        await dispatch<any>(getDecks.action());
      } else {
        await dispatch<any>(setDecks.action(state.speakerdeckDesks.decks.data.decks));
      }

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
        ...store.getState(),
        speakerdeckDesks: state.speakerdeckDesks,
      });
    })();
  }, []);

  const itemsElement = state.speakerdeckDesks.decks.data.decks.map(deck => {
    return (
      <li key={deck.sha}>
        <LinkComponent href="/blogs/speakerdeck/[name]" as={`/blogs/speakerdeck/${deck.name}`}>
          {deck.name}
        </LinkComponent>
      </li>
    );
  });

  return (
    <>
      <Head>
        <title>Syonet - Speaker Deck</title>
        <meta content="Speaker Deckバックアップ" name="description"></meta>
        <meta property="og:title" content="Syonet - Speaker Deck" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/blogs/speakerdeck/ogp.png`} />
        <meta property="og:description" content="Speaker Deckバックアップ" />
      </Head>
      <WrapperComponent {...state}>
        <h1>Speaker Deck バックアップ</h1>
        <ul>{itemsElement}</ul>
      </WrapperComponent>
    </>
  );
};

BlogsSpeakerdeckPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  await context.store.dispatch<any>(getDecks.action());
  const state: AppState = context.store.getState();
  return { ...state };
};

export default BlogsSpeakerdeckPageComponent;
