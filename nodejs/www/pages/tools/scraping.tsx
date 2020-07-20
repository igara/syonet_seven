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
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "Web魚拓っぽい",
  path: "static/ogp/tools/scraping",
};

type Props = AppState;

const ToolsScrapingPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  const [url, setURL] = useState("");
  const changeURL = (event: ChangeEvent<HTMLInputElement>) => setURL(event.target.value);
  const [html, setHTML] = useState("");
  const [title, setTitle] = useState("");
  const [fileID, setFileID] = useState("");
  const [directoryID, setDirectoryID] = useState("");

  const [loadExecScraping, resultExecScraping] = useLazyQuery<ExecScraping>(EXEC_SCRAPING, {
    onCompleted: async data => {
      setHTML(data.execScraping.html);

      const t = data.execScraping.html.match(/<title>.*<\/title>/);
      if (t) setTitle(t[0].replace("<title>", "").replace("</title>", ""));
    },
  });

  const [loadSaveScrapingHTML, resultSaveScrapingHTML] = useMutation<SaveScrapingHTML>(SAVE_SCRAPING_HTML, {
    onCompleted: async data => {
      setFileID(data.saveScrapingHTML.fileID);
      setDirectoryID(data.saveScrapingHTML.directoryID);
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

  const description = "指定したサイトのURLからCSS、JavaScript、画像含めてひとつのHTMLに生成します";

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content={description} name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${ogp.title}.png`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent {...state}>
        <div className={toolsScrapingStyle.wrapper}>
          <h2>{ogp.title}</h2>
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
              setTitle("");
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
          <div>
            タイトル: {title} {resultExecScraping.loading && "読み込み中..."}
          </div>

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
                      setFileID("");
                      setDirectoryID("");
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
                <td>FileID: </td>
                <td>
                  {fileID && (
                    <a
                      href={`https://drive.google.com/file/d/${fileID}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fileID}
                    </a>
                  )}
                  {resultSaveScrapingHTML.loading && "読み込み中..."}
                </td>
              </tr>
              <tr>
                <td>DirectoryID: </td>
                <td>
                  {directoryID && (
                    <a
                      href={`https://drive.google.com/drive/folders/${directoryID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {directoryID}
                    </a>
                  )}
                  {resultSaveScrapingHTML.loading && "読み込み中..."}
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

  if (context.isServer) {
    await createOGPImage({
      path: ogp.path,
      title: ogp.title,
    });
  }

  return { ...state };
};

export default ToolsScrapingPageComponent;
