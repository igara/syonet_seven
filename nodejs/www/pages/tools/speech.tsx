import { WrapperComponent } from "@www/components/wrapper";
import style from "@www/styles/tools/speech.module.css";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { createOGPImage } from "@www/libs/ogp_image";
import { SelectComponent } from "@www/components/common/input/select";

const ogp = {
  title: "Speech To Text",
  path: "ogp/tools/speech",
};

type Props = AppState;

const ToolsSpeechPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
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

  const backgroundColors = [
    { name: "緑", value: "greenyellow" },
    { name: "青", value: "blue" },
    { name: "白", value: "white" },
  ];
  const [backgroundColor, setBackgroundColor] = useState(backgroundColors[0].value);
  const jpTextlementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.browser) {
      (async () => {
        await loadCheckAuth();
        setState(store.getState());

        const speechRecognition = webkitSpeechRecognition || SpeechRecognition;

        const jpRecognition = new speechRecognition();
        jpRecognition.lang = "ja-JP";
        jpRecognition.continuous = true;
        jpRecognition.onresult = event => {
          if (jpTextlementRef.current)
            jpTextlementRef.current.innerText = `${event.results[event.results.length - 1][0].transcript}`;
        };
        jpRecognition.onend = () => {
          jpRecognition.start();
        };
        jpRecognition.start();
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content="音声を元にテキスト化する" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${encodeURI(ogp.title)}.png`} />
        <meta property="og:description" content="音声を元にテキスト化する" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent {...state}>
        <div className={style.wrapper}>
          <div>
            背景色変更
            <SelectComponent
              OnChangeHandler={(e: ChangeEvent<HTMLSelectElement>) => {
                setBackgroundColor(e.target.value);
              }}
            >
              {backgroundColors.map(backgroundColor => (
                <option key={backgroundColor.value} value={backgroundColor.value}>
                  {backgroundColor.name}
                </option>
              ))}
            </SelectComponent>
          </div>
          <div style={{ background: backgroundColor }} className={style.textarea}>
            <div ref={jpTextlementRef} />
          </div>
        </div>
      </WrapperComponent>
    </>
  );
};

ToolsSpeechPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();

  if (context.isServer) {
    await createOGPImage({
      path: ogp.path,
      title: ogp.title,
    });
  }

  return { ...state };
};

export default ToolsSpeechPageComponent;
