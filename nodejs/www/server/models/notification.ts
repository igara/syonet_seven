import { Document, Schema } from "mongoose";
import mongo from "./index";

export type InsertNotificationParam = {
	endpoint: string;
	auth: string;
	p256dh: string;
};

export interface NotificationData {
	_id: string;
	endpoint: string;
	auth: string;
	p256dh: string;
}

export interface NotificationDocument extends Document {
	_id: string;
	endpoint: string;
	auth: string;
	p256dh: string;
}

const NotificationSchema: Schema = new mongo.Schema(
	{
		endpoint: String,
		auth: String,
		p256dh: String
	},
	{ collection: "notifications" }
);

/**
 * WebPushに必要な情報を追加
 */
export const insertNotification = async (
	notification: InsertNotificationParam
): Promise<NotificationDocument> => {
	const N = new Notification();
	N.endpoint = notification.endpoint;
	N.auth = notification.auth;
	N.p256dh = notification.p256dh;
	const result = await N.save();
	return result;
};

NotificationSchema.methods.insertNotification = insertNotification;

/**
 * 通知必要な情報を取得
 */
export const getNotificationList = async (): Promise<
	Array<NotificationDocument>
> => {
	const notificationList = await Notification.find({});
	return notificationList;
};

NotificationSchema.methods.getNotificationList = getNotificationList;

/**
 * 通知必要な情報を取得
 */
export const getNotification = async (notification: {
	endpoint: string;
	auth: string;
	p256dh: string;
}): Promise<NotificationDocument | null> => {
	const notificationList = await Notification.findOne({
		...notification
	}).exec();
	return notificationList;
};

NotificationSchema.methods.getNotification = getNotification;

const Notification = mongo.model<NotificationDocument>(
	"Notification",
	NotificationSchema
);

export default Notification;
