// discord.js モジュールのインポート
import * as Discord from "discord.js";
import child_process from "child_process";
import * as webpush from "web-push";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as Notification from "@www/models/mongoose/notification";

export const connect = () => {
  // Discord Clientのインスタンス作成
  const client = new Discord.Client();
  const TOKEN = process.env.DISCORD_BOT_TOKEN;
  const CHANNEL_ID = process.env.DISCORD_BOT_CHANNEL_ID;
  const ADMIN_USER_ID = JSON.parse(process.env.DISCORD_ADMIN_USER_ID || "");
  const REMOTE_DEPLOY_COMMAND = process.env.REMOTE_DEPLOY_COMMAND || "";
  const DISCORD_WEBHOCK = process.env.DISCORD_WEBHOCK;

  const contact = process.env.WEBPUSH_CONTACT || "";
  const vapidKeys = {
    publicKey: process.env.WEBPUSH_VAPIDKEYS_PUBLIC || "",
    privateKey: process.env.WEBPUSH_VAPIDKEYS_PRIVATE || "",
  };
  webpush.setVapidDetails(contact, vapidKeys.publicKey, vapidKeys.privateKey);

  // 準備完了イベントのconsole.logで通知黒い画面に出る。
  client.on("ready", () => {
    const result = child_process.execSync(`
	curl -H "Accept: application/json" \
	-H "Content-type: application/json" \
	-X POST -d '{"username":"syonet.work","content":"syonet.workは再起動しました。"}' '${DISCORD_WEBHOCK}'`);
    console.log(result);
  });

  // メッセージがあったら何かをする
  client.on("message", message => {
    if (CHANNEL_ID != message.channel.id) {
      return;
    }
    if (message.content === "@bot help") {
      const sendText = `デプロイ: @bot deploy latest
通知: @bot webpush [通知タイトル] [通知メッセージ]
`;
      message
        .reply(sendText)
        .then(() => {
          console.log("helped");
        })
        .catch(console.error);
    }
    // メッセージの文字列による条件分岐
    if (message.content === "@bot deploy latest") {
      const author = message.author;
      if (ADMIN_USER_ID.includes(+author.id)) {
        const sendText = `今からsyonet.workを最新化します。`;
        message
          .reply(sendText)
          .then(() => {
            console.log(`Sent message: ${sendText}`);
            const result = child_process.execSync(REMOTE_DEPLOY_COMMAND);
            console.log(result);
          })
          .catch(console.error);
      } else {
        const sendText = `どうも。${author.username}さん。
このコマンドの実行権限はございません。`;
        message
          .reply(sendText)
          .then(() => console.log(`Sent message: ${sendText}`))
          .catch(console.error);
      }
    }
    if (/^@bot webpush \[\S+\] \[\S+\]/.test(message.content)) {
      const author = message.author;
      if (ADMIN_USER_ID.includes(+author.id)) {
        const sendText = `通知します`;
        message
          .reply(sendText)
          .then(async () => {
            console.log(`Sent message: ${sendText}`);
            const weppushContent = message.content.match(/\[\S+\]/g);
            if (!weppushContent) return;
            const title = weppushContent[0].replace("[", "").replace("]", "");
            const body = weppushContent[1].replace("[", "").replace("]", "");

            await dbConnect();
            const notifications = await Notification.getNotificationList();
            await dbClose();
            await Promise.all(
              notifications.map(notification => {
                const subscription = {
                  endpoint: notification.endpoint,
                  keys: {
                    auth: notification.auth,
                    p256dh: notification.p256dh,
                  },
                };

                // プッシュ通知で送信したい任意のデータ
                const payload = JSON.stringify({
                  title,
                  body,
                  icon: "https://avatars3.githubusercontent.com/u/7006562?s=460&v=4",
                  url: process.env.WWW_HOST,
                });

                // 購読時に, クライアントサイドから取得したエンドポイント URI に対して POST リクエストを送信
                webpush
                  .sendNotification(subscription, payload)
                  .then()
                  .catch(e => console.error(`webpush error ${e}`));
              }),
            )
              .then(r => console.log(`promise all success ${r}`))
              .catch(e => console.log(`promise all error ${e}`));
          })
          .catch(e => console.error(`message error ${e}`));
      } else {
        const sendText = `どうも。${author.username}さん。
このコマンドの実行権限はございません。`;
        message
          .reply(sendText)
          .then(() => console.log(`Sent message: ${sendText}`))
          .catch(console.error);
      }
    }
  });

  // Discordへの接続
  client.login(TOKEN);
};
