import { WrapperComponent } from "@www/components/wrapper";
import { toolsSFUChatStyle } from "@www/styles";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { TextComponent } from "@www/components/common/input/text";
import { ButtonComponent } from "@www/components/common/input/button";
import { createSFUChat, getSFUChat } from "@www/actions/tools/sfu_chat";
import { LinkComponent } from "@www/components/common/link";

type Props = AppState;

const ToolsSFUChatPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const accessTokens = await db.access_tokens.toArray();
        const token = accessTokens.length > 0 ? accessTokens[0].token : "";

        if (token) {
          await dispatch<any>(checkLogin.action(token));
        }

        const storeState: AppState = store.getState();
        if (!storeState.login.login.data.user) {
          await db.access_tokens.clear();
        }
        setState(storeState);
      })();
    }
  }, []);

  const [chatID, setChatID] = useState("");
  const changeChatID = (event: ChangeEvent<HTMLInputElement>) => setChatID(event.target.value);
  const [joinPassword, setJoinPassword] = useState("");
  const changeJoinPassword = (event: ChangeEvent<HTMLInputElement>) => setJoinPassword(event.target.value);

  const [chatName, setChatName] = useState("");
  const changeChatName = (event: ChangeEvent<HTMLInputElement>) => setChatName(event.target.value);
  const [password, setPassword] = useState("");
  const changePassword = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  const onClickJoinButtonCallback = useCallback(async () => {
    if (process.browser) {
      try{
        await dispatch(getSFUChat({ id: chatID, password: joinPassword }));
      } catch (error) {
        console.error(error);
      }
      const storeState: AppState = store.getState();
      const stateChatID = storeState.sfuChat.chat.data.chat?._id;
      if (stateChatID) {
        await db.chats.put({
          id: stateChatID,
          password
        });
        location.href = `/tools/sfu_chat/${chatID}`;
      }
      setState(storeState);
    }
  }, [chatID, joinPassword]);

  return (
    <>
      <Head>
        <title>Syonet - SFU Chat</title>
      </Head>
      <WrapperComponent {...state}>
        <div className={toolsSFUChatStyle.wrapper}>
          <h2>SFU Chat</h2>
          <hr />
          <h3>ログイン中ユーザ</h3>
          <table>
            <tbody>
              <tr>
                <td>
                  {state.login.login.data.user?.displayName || "???"}
                </td>
                <td className={toolsSFUChatStyle.validation}>
                  {state.login.login.data.user?.displayName ?
                    "" : 
                    <LinkComponent href="/login">
                      ログインしていません。
                    </LinkComponent>
                  }
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  ログインしていなくてもチャットの利用可能です。
                  <br />
                  今後Googleと連携したようなものにする予定です。
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
          <h3>部屋参加</h3>
          <table>
            <tbody>
              <tr>
                <td>
                  <TextComponent DefalutValue="" Placeholder="部屋ID" OnChangeHandler={changeChatID} />
                </td>
                <td className={toolsSFUChatStyle.validation}>{chatID ? "" : "部屋IDを入力してください"}</td>
              </tr>
              <tr>
                <td>
                  <TextComponent DefalutValue="" Placeholder="部屋のパスワード" OnChangeHandler={changeJoinPassword} />
                </td>
              </tr>
            </tbody>
          </table>
          <ButtonComponent
            OnClickHandler={onClickJoinButtonCallback}
            Abled={!Boolean(chatID)}
          >
            参加
          </ButtonComponent>
          {
            chatID && state.sfuChat.chat.error ?
            <span className={toolsSFUChatStyle.validation}>部屋の名前かパスワードが間違っております</span>
            :
            null
          }
          <hr />
          <h3>部屋作成</h3>
          <table>
            <tbody>
              <tr>
                <td>
                  <TextComponent DefalutValue="" Placeholder="部屋の名前" OnChangeHandler={changeChatName} />
                </td>
                <td className={toolsSFUChatStyle.validation}>{chatName ? "" : "部屋の名前を入力してください"}</td>
              </tr>
              <tr>
                <td>
                  <TextComponent DefalutValue="" Placeholder="部屋のパスワード" OnChangeHandler={changePassword} />
                </td>
              </tr>
            </tbody>
          </table>
          <ButtonComponent
            OnClickHandler={async () => {
              if (process.browser) {
                await dispatch(createSFUChat({ name: chatName, password }));
                const storeState: AppState = store.getState();
                const chatID = storeState.sfuChat.chat.data.chat._id;
                if (chatID) {
                  await db.chats.put({
                    id: chatID,
                    password
                  });
                  location.href = `/tools/sfu_chat/${chatID}`;
                }
              }
            }}
            Abled={!Boolean(chatName)}
          >
            作成
          </ButtonComponent>
        </div>
      </WrapperComponent>
    </>
  );
};

ToolsSFUChatPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsSFUChatPageComponent;
