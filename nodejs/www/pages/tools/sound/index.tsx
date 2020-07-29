import { WrapperComponent } from "@www/components/wrapper";
// import style from "@www/styles/tools/sound.module.css";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { TextComponent } from "@www/components/common/input/text";
import { FileComponent } from "@www/components/common/input/file";
import { ButtonComponent } from "@www/components/common/input/button";
import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { CREATE_SOUND, CreateSound, SEARCH_SOUND, SearchSound } from "@www/libs/apollo/gql/sound";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "音楽検索",
  path: "ogp/tools/sound",
};

type Props = AppState;

const ToolsSoundPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  const [name, setName] = useState("");
  const changeName = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value);

  const [peaks, setPeaks] = useState("");
  console.log(peaks);

  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const changeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const waveformElement = document.getElementById("waveform");
      if (waveformElement) {
        const childElement = waveformElement.firstChild;
        if (childElement) childElement.remove();
      }

      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = async evt => {
        if (evt.target && evt.target.result) {
          const Wavesurfer = await import("wavesurfer.js");
          const wave = Wavesurfer.default.create({
            container: "#waveform",
            waveColor: "violet",
            progressColor: "purple",
            scrollParent: true,
          });
          wave.on("ready", async () => {
            const newPeaks = ((wave.backend as any).mergedPeaks as number[])
              .map(peak => Math.floor(peak * Math.pow(10, 5)) / Math.pow(10, 5) || 0)
              .join(" ");
            setPeaks(newPeaks);
          });
          wave.load(evt.target.result.toString());
          setWavesurfer(wave);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

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

  const [loadSearchSound] = useLazyQuery<SearchSound>(SEARCH_SOUND, {
    onCompleted: async searchSound => {
      if (searchSound.searchSound) {
        console.log(searchSound);
      }
    },
  });

  const [loadCreateSound] = useMutation<CreateSound>(CREATE_SOUND, {
    onCompleted: async data => {
      console.log(data);
    },
  });

  useEffect(() => {
    if (process.browser) {
      (async () => {
        await loadCheckAuth();

        setState(store.getState());
      })();
    }
  }, []);

  const description = "音楽検索を行う";

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${encodeURI(ogp.title)}.png`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent {...state}>
        <h2>{ogp.title}</h2>
        <div>{description}</div>

        <hr />
        <h3>音源解析</h3>
        <div
          id="waveform"
          onClick={() => {
            if (!wavesurfer) return;
            if (wavesurfer.isPlaying()) {
              wavesurfer.pause();
            } else {
              wavesurfer.play();
            }
          }}
        />
        <FileComponent Key={"sound"} Accept={"audio/*"} OnInputHandler={changeFile} />
        <hr />
        <h3>音源解析を元に検索</h3>
        <ButtonComponent
          OnClickHandler={() =>
            loadSearchSound({
              variables: {
                peaks,
              },
            })
          }
          Abled={!peaks}
        >
          検索
        </ButtonComponent>
        <hr />
        <h3>音源を元に名前をつけて登録</h3>
        <TextComponent DefalutValue="" Placeholder="曲名" OnChangeHandler={changeName} />
        <ButtonComponent
          OnClickHandler={() =>
            loadCreateSound({
              variables: {
                name,
                peaks,
              },
            })
          }
          Abled={!(peaks && name)}
        >
          登録
        </ButtonComponent>
      </WrapperComponent>
    </>
  );
};

ToolsSoundPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();

  if (context.isServer) {
    await createOGPImage({
      path: ogp.path,
      title: ogp.title,
    });
  }

  return { ...state };
};

export default ToolsSoundPageComponent;
