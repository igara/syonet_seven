import { WrapperComponent } from "@www/components/wrapper";
import toolsP2PChatStyle from "@www/styles/tools/p2p_chat.module.css";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { checkLogin } from "@www/actions/common/login";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { TextComponent } from "@www/components/common/input/text";
import { ButtonComponent } from "@www/components/common/input/button";
import { LinkComponent } from "@www/components/common/link";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { CREATE_CHAT, CreateChat, GetChatByIdAndPassword, GET_CHAT_BY_ID_AND_PASSWORD } from "@www/libs/apollo/gql/chat";

type Props = AppState;

const ToolsP2PChatPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();

  const [loadGetChatByIdAndPassword, { error }] = useLazyQuery<GetChatByIdAndPassword>(GET_CHAT_BY_ID_AND_PASSWORD, {
    onCompleted: async (data) => {
      await db.chats.put({
        id: data.getChatByIdAndPassword.id,
        password
      });
  
      location.href = `/tools/p2p_chat/${data.getChatByIdAndPassword.id}`;
    }
  });

  const [loadCreateChat] = useMutation<CreateChat>(CREATE_CHAT, {
    onCompleted: async (data) => {
      await db.chats.put({
        id: data.createChat.id,
        password
      });
  
      location.href = `/tools/p2p_chat/${data.createChat.id}`;
    }
  });

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

  const [chatID, setChatID] = useState(0);
  const changeChatID = (event: ChangeEvent<HTMLInputElement>) => setChatID(Number(event.target.value));
  const [joinPassword, setJoinPassword] = useState("");
  const changeJoinPassword = (event: ChangeEvent<HTMLInputElement>) => setJoinPassword(event.target.value);

  const [chatName, setChatName] = useState("");
  const changeChatName = (event: ChangeEvent<HTMLInputElement>) => setChatName(event.target.value);
  const [password, setPassword] = useState("");
  const changePassword = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  return (
    <>
      <Head>
        <title>Syonet - P2P Chat</title>
      </Head>
      <WrapperComponent {...state}>
        <div className={toolsP2PChatStyle.wrapper}>
          <h2>P2P Chat</h2>
          <hr />
          <h3>ログイン中ユーザ</h3>
          <table>
            <tbody>
              <tr>
                <td>
                  {state.login.login.data.user?.displayName || "???"}
                </td>
                <td className={toolsP2PChatStyle.validation}>
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
                <td className={toolsP2PChatStyle.validation}>{chatID ? "" : "部屋IDを入力してください"}</td>
              </tr>
              <tr>
                <td>
                  <TextComponent DefalutValue="" Placeholder="部屋のパスワード" OnChangeHandler={changeJoinPassword} />
                </td>
              </tr>
            </tbody>
          </table>
          <ButtonComponent
            OnClickHandler={() => {
              loadGetChatByIdAndPassword({
                variables: {
                  id: chatID,
                  password: joinPassword
                }
              })
            }}
            Abled={!Boolean(chatID)}
          >
            参加
          </ButtonComponent>
          {
            chatID && error ?
            <span className={toolsP2PChatStyle.validation}>部屋の名前かパスワードが間違っております</span>
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
                <td className={toolsP2PChatStyle.validation}>{chatName ? "" : "部屋の名前を入力してください"}</td>
              </tr>
              <tr>
                <td>
                  <TextComponent DefalutValue="" Placeholder="部屋のパスワード" OnChangeHandler={changePassword} />
                </td>
              </tr>
            </tbody>
          </table>
          <ButtonComponent
            OnClickHandler={() => {
              loadCreateChat({
                variables: {
                  name: chatName,
                  password
                }
              });
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

ToolsP2PChatPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsP2PChatPageComponent;
