// discord.js モジュールのインポート
import * as Discord from "discord.js";
import child_process from "child_process";
import * as webpush from "web-push";
import { connect as connectTypeORM } from "@www/models/typeorm/connection";
import { WebPushUser } from "@www/models/typeorm/entities/webpush_user";
import { WebPushMessage } from "@www/models/typeorm/entities/webpush_message";

export const connect = () => {
  // Discord Clientのインスタンス作成
  const client = new Discord.Client();
  const TOKEN = process.env.DISCORD_BOT_TOKEN;
  const CHANNEL_ID = process.env.DISCORD_BOT_CHANNEL_ID;
  const ADMIN_USER_ID = JSON.parse(process.env.DISCORD_ADMIN_USER_ID || "");
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
      const sendText = `通知: @bot webpush [通知タイトル] [通知メッセージ]`;
      message
        .reply(sendText)
        .then(() => {
          console.log("helped");
        })
        .catch(console.error);
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

            // プッシュ通知で送信したい任意のデータ
            const payload = {
              title,
              body,
              icon: "https://avatars3.githubusercontent.com/u/7006562?s=460&v=4",
              url: process.env.WWW_HOST || "",
            };
            const sendPayload = JSON.stringify(payload);

            const connect = await connectTypeORM();
            WebPushMessage.useConnection(connect);
            WebPushUser.useConnection(connect);

            const webPushMessage = WebPushMessage.create({
              title,
              body,
              icon: payload.icon,
              url: payload.url,
            });
            await webPushMessage.save();

            const webPushUsers = await WebPushUser.find();
            await Promise.all(
              webPushUsers.map(webPushUser => {
                const subscription = {
                  endpoint: webPushUser.endpoint,
                  keys: {
                    auth: webPushUser.auth,
                    p256dh: webPushUser.p256dh,
                  },
                };

                // 購読時に, クライアントサイドから取得したエンドポイント URI に対して POST リクエストを送信
                webpush
                  .sendNotification(subscription, sendPayload)
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
