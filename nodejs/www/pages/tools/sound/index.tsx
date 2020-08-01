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
  const [artist, setArtist] = useState("");
  const changeArtist = (event: ChangeEvent<HTMLInputElement>) => setArtist(event.target.value);

  const [searchName, setSearchName] = useState("");
  const [searchArtist, setSearchArtist] = useState("");

  const [peaks, setPeaks] = useState<number[]>([]);
  const [regionPeaks, setRegionPeaks] = useState<number[]>([]);

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
          // @ts-ignore
          const timelinePlugin = await import("wavesurfer.js/dist/plugin/wavesurfer.timeline.js");
          // @ts-ignore
          const regionsPlugin = await import("wavesurfer.js/dist/plugin/wavesurfer.regions.js");
          const region = regionsPlugin.default.create({
            regions: [
              {
                start: 0,
                end: 5,
                color: "hsla(400, 100%, 30%, 0.1)",
              },
            ],
          });

          const wave = Wavesurfer.default.create({
            container: "#waveform",
            waveColor: "violet",
            progressColor: "purple",
            scrollParent: true,
            plugins: [
              region,
              timelinePlugin.default.create({
                container: "#timeline",
              }),
            ],
          });
          wave.on("ready", async () => {
            const newPeaks = ((wave.backend as any).mergedPeaks as number[]).map(
              peak => Math.floor(peak * Math.pow(10, 7)) / Math.pow(10, 7) || 0,
            );
            setPeaks(newPeaks);
            const p = (wave.backend.getPeaks(2024, 0, 5) as number[]).map(
              peak => Math.floor(peak * Math.pow(10, 7)) / Math.pow(10, 7) || 0,
            );
            setRegionPeaks(p);
          });
          wave.on("region-update-end", async (e: any) => {
            const p = (wave.backend.getPeaks(2024, Math.floor(e.start), Math.floor(e.end)) as number[]).map(
              peak => Math.floor(peak * Math.pow(10, 7)) / Math.pow(10, 7) || 0,
            );
            setRegionPeaks(p);
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
        setSearchName(searchSound.searchSound.name);
        setSearchArtist(searchSound.searchSound.artist);
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
        <div id="timeline" />

        <FileComponent Key={"sound"} Accept={"audio/*"} OnInputHandler={changeFile} />
        <hr />
        <h3>音源解析を元に検索</h3>
        <ButtonComponent
          OnClickHandler={() =>
            loadSearchSound({
              variables: {
                peaks: regionPeaks.join(" "),
              },
            })
          }
          Abled={!peaks}
        >
          検索
        </ButtonComponent>
        <br />
        {searchName && searchArtist && (
          <>
            この音源は
            <br />
            曲名: {searchName}
            <br />
            アーティスト: {searchArtist}
          </>
        )}

        <hr />
        <h3>音源を元に名前をつけて登録</h3>
        <TextComponent DefalutValue="" Placeholder="曲名" OnChangeHandler={changeName} />
        <br />
        <TextComponent DefalutValue="" Placeholder="アーティスト" OnChangeHandler={changeArtist} />
        <br />
        <ButtonComponent
          OnClickHandler={() =>
            loadCreateSound({
              variables: {
                name,
                artist,
                peaks: peaks.join(" "),
              },
            })
          }
          Abled={!(peaks && name && artist)}
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
