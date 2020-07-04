import { WrapperComponent } from "@www/components/wrapper";
import toolsScrapingStyle from "@www/styles/tools/scraping.module.css";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { authActions } from "@www/actions/common/auth";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { TextComponent } from "@www/components/common/input/text";
import { TextAreaComponent } from "@www/components/common/input/textarea";
import { ButtonComponent } from "@www/components/common/input/button";
import { LinkComponent } from "@www/components/common/link";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import {
  EXEC_SCRAPING,
  ExecScraping,
  SAVE_SCRAPING_HTML,
  SaveScrapingHTML,
} from "@www/libs/apollo/gql/google/scraping";

type Props = AppState;

const ToolsScrapingPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  const [url, setURL] = useState("");
  const changeURL = (event: ChangeEvent<HTMLInputElement>) => setURL(event.target.value);
  const [html, setHTML] = useState("");
  const [title, setTitle] = useState("");
  const [driveID, setDriveID] = useState("");

  const [loadExecScraping] = useLazyQuery<ExecScraping>(EXEC_SCRAPING, {
    onCompleted: async data => {
      setHTML(data.execScraping.html);

      const t = data.execScraping.html.match(/<title>.*<\/title>/);
      if (t) setTitle(t[0].replace("<title>", "").replace("</title>", ""));
    },
  });

  const [loadSaveScrapingHTML] = useMutation<SaveScrapingHTML>(SAVE_SCRAPING_HTML, {
    onCompleted: async data => {
      setDriveID(data.saveScrapingHTML.driveID);
    },
  });

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
    if (process.browser) {
      (async () => {
        await loadCheckAuth();
        setState(store.getState());
      })();
    }
  }, []);

  const pageTitle = "Web魚拓っぽい";
  const description = "指定したサイトのURLからCSS、JavaScript、画像含めてひとつのHTMLに生成します";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta content={description} name="description"></meta>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/tools/scraping/ogp.png`} />
        <meta property="og:description" content={description} />
      </Head>
      <WrapperComponent {...state}>
        <div className={toolsScrapingStyle.wrapper}>
          <h2>{pageTitle}</h2>
          <div>{description}</div>
          <hr />

          <table>
            <tbody>
              <tr>
                <td>
                  <TextComponent DefalutValue="" Placeholder="URL" OnChangeHandler={changeURL} />
                </td>
                <td className={toolsScrapingStyle.validation}>
                  {/^(https|http):\/\/\S*/.test(url) ? "" : "正しいURLを入力してください"}
                </td>
              </tr>
            </tbody>
          </table>
          <ButtonComponent
            OnClickHandler={() => {
              setHTML("");
              setTitle("読み込み中...");
              loadExecScraping({
                variables: {
                  url,
                },
              });
            }}
            Abled={!Boolean(url)}
          >
            生成
          </ButtonComponent>
          <br />
          <TextAreaComponent
            DefalutValue={html}
            Placeholder="HTML"
            ClassName={toolsScrapingStyle.htmlText}
            ReadOnly={true}
          />
          <div>タイトル: {title}</div>

          <ButtonComponent
            OnClickHandler={() => {
              const blob = new Blob([html], { type: "text/plan" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "preview.html";
              link.click();
            }}
            Abled={!Boolean(html)}
          >
            プレビュー
          </ButtonComponent>

          <hr />
          <h3>ログイン中ユーザ</h3>
          <table>
            <tbody>
              <tr>
                <td>{(state.auth.username && state.auth.type === "AuthGoogle") || "???"}</td>
                <td className={toolsScrapingStyle.validation}>
                  {state.auth.username && state.auth.type === "AuthGoogle" ? (
                    state.auth.username
                  ) : (
                    <LinkComponent href="/login">Googleログインしていません。</LinkComponent>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <ButtonComponent
                    OnClickHandler={() => {
                      setDriveID("読み込み中...");
                      loadSaveScrapingHTML({
                        variables: {
                          html,
                          title,
                          url,
                        },
                      });
                    }}
                    Abled={!Boolean(html && state.auth.username && state.auth.type === "AuthGoogle")}
                  >
                    保存
                  </ButtonComponent>
                </td>
              </tr>
              <tr>
                <td>DriveID: </td>
                <td>
                  {driveID && (
                    <a
                      href={`https://drive.google.com/file/d/${driveID}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {driveID}
                    </a>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </WrapperComponent>
    </>
  );
};

ToolsScrapingPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsScrapingPageComponent;
