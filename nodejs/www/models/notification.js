// @flow
import mongo from './index'

import mongoose from 'mongoose'
type IndexModelType = mongoose

export type InsertNotificationParam = {
	endpoint: string,
	auth: string,
	p256dh: string,
}

export type InsertNotificationReturn = {
	_id: string,
	endpoint: string,
	auth: string,
	p256dh: string,
}

export type NotificationInfoData = {
	_id: string,
	endpoint: string,
	auth: string,
	p256dh: string,
}

export type GetNotificationInfoReturn = {
	_id: string,
	endpoint: string,
	auth: string,
	p256dh: string,
}

export type NotificationModelType = IndexModelType & {
	insertNotification: InsertNotificationParam => Promise<InsertNotificationReturn>,
	getNotificationInfo: () => Promise<GetNotificationInfoReturn>,
}

const NotificationSchema = mongo.Schema(
	{
		endpoint: String,
		auth: String,
		p256dh: String,
	},
	{ collection: 'notifications' },
)

/**
 * WebPushに必要な情報を追加
 * @param {InsertNotificationParam} notification
 * @return {InsertNotificationReturn} findResult
 */
export const insertNotification = async (
	notification: InsertNotificationParam,
): Promise<InsertNotificationReturn> => {
	const N = new Notification()
	N.endpoint = notification.endpoint
	N.auth = notification.auth
	N.p256dh = notification.p256dh
	const result = await N.save()
	return result
}

NotificationSchema.methods.insertNotification = insertNotification

/**
 * 通知必要な情報を取得
 */
export const getNotificationList = async (): Promise<Array<Object>> => {
	const notificationList: Array<NotificationInfoData> = await Notification.find(
		{},
	)
	return notificationList
}

NotificationSchema.methods.getNotificationList = getNotificationList

const Notification: NotificationModelType = mongo.model(
	'Notification',
	NotificationSchema,
)

export default Notification
