import { NextApiRequest, NextApiResponse } from "next";
import webpush from "web-push";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as Notification from "@www/models/mongoose/notification";

const contact = process.env.WEBPUSH_CONTACT ? process.env.WEBPUSH_CONTACT : "";
const vapidKeys = {
  publicKey: process.env.WEBPUSH_VAPIDKEYS_PUBLIC ? process.env.WEBPUSH_VAPIDKEYS_PUBLIC : "",
  privateKey: process.env.WEBPUSH_VAPIDKEYS_PRIVATE ? process.env.WEBPUSH_VAPIDKEYS_PRIVATE : "",
};

webpush.setVapidDetails(contact, vapidKeys.publicKey, vapidKeys.privateKey);

const postWebpush = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let notification;
    const body = JSON.parse(req.body);
    if (
      typeof body !== "undefined" &&
      body !== null &&
      typeof body.endpoint === "string" &&
      typeof body.auth === "string" &&
      typeof body.p256dh === "string"
    ) {
      notification = {
        endpoint: body.endpoint,
        auth: body.auth,
        p256dh: body.p256dh,
      };
    } else {
      res.status(500);
      return res.send({
        status: 500,
        message: "NG",
      });
    }
    await dbConnect();

    const findResult = await Notification.getNotification({
      ...notification,
    });
    if (findResult) {
      return res.send({
        status: 200,
        message: "Registed",
      });
    }
    await Notification.insertNotification(notification);

    const subscription = {
      endpoint: notification.endpoint,
      keys: {
        auth: notification.auth,
        p256dh: notification.p256dh,
      },
    };

    // プッシュ通知で送信したい任意のデータ
    const payload = JSON.stringify({
      title: "[syonet]通知ONにしました",
      body: "たまに更新しましたら通知いくように頑張ります",
      icon: "https://avatars3.githubusercontent.com/u/7006562?s=460&v=4",
      url: process.env.WWW_HOST,
    });

    // 購読時に, クライアントサイドから取得したエンドポイント URI に対して POST リクエストを送信
    await webpush.sendNotification(subscription, payload);
    res.status(200);
    return res.send({
      status: 200,
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    return res.send({
      status: 500,
      message: "NG",
    });
  } finally {
    await dbClose();
  }
};

export default postWebpush;
