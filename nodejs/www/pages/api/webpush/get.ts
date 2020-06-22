import { NextApiRequest, NextApiResponse } from "next";
import * as webpush from "web-push";

const contact = process.env.WEBPUSH_CONTACT ? process.env.WEBPUSH_CONTACT : "";
const vapidKeys = {
  publicKey: process.env.WEBPUSH_VAPIDKEYS_PUBLIC ? process.env.WEBPUSH_VAPIDKEYS_PUBLIC : "",
  privateKey: process.env.WEBPUSH_VAPIDKEYS_PRIVATE ? process.env.WEBPUSH_VAPIDKEYS_PRIVATE : "",
};

webpush.setVapidDetails(contact, vapidKeys.publicKey, vapidKeys.privateKey);

export const getWebpushKey = async (_req: NextApiRequest, res: NextApiResponse) => {
  return res.json({
    publicKey: vapidKeys.publicKey,
  });
};

export default getWebpushKey;
