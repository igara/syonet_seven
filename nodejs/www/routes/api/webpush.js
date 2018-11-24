// @flow

import express from 'express'
import webpush from 'web-push'
import { dbConnect, dbClose } from '@www/models'
import Notification from '@www/models/notification'
import type { NotificationModelType } from '@www/models/notification'

const contact = process.env.WEBPUSH_CONTACT
const vapidKeys = {
	publicKey: process.env.WEBPUSH_VAPIDKEYS_PUBLIC,
	privateKey: process.env.WEBPUSH_VAPIDKEYS_PRIVATE,
}

webpush.setVapidDetails(contact, vapidKeys.publicKey, vapidKeys.privateKey)

const router = express.Router()

const getWebpushKey = async (
	req: express$Request,
	res: express$Response,
	next,
) => {
	return res.json({
		publicKey: vapidKeys.publicKey,
	})
}

router.get('/', getWebpushKey)

const postWebpush = async (
	req: express$Request,
	res: express$Response,
	next,
) => {
	try {
		let notification
		if (
			typeof req.body !== 'undefined' &&
			req.body !== null &&
			typeof req.body.endpoint === 'string' &&
			typeof req.body.auth === 'string' &&
			typeof req.body.p256dh === 'string'
		) {
			notification = {
				endpoint: req.body.endpoint,
				auth: req.body.auth,
				p256dh: req.body.p256dh,
			}
		} else {
			res.status(500)
			return res.send({
				status: 500,
				message: 'NG',
			})
		}

		await dbConnect()

		const findResult = await Notification.findOne({
			...notification,
		}).exec()
		if (findResult) {
			return res.send({
				status: 200,
				message: 'Registed',
			})
		}
		const notificationModel: NotificationModelType = new Notification()
		await notificationModel.insertNotification(notification)

		const subscription = {
			endpoint: notification.endpoint,
			keys: {
				auth: notification.auth,
				p256dh: notification.p256dh,
			},
		}

		const host = req.get('host')
		if (typeof host !== 'string') {
			res.status(500)
			return res.send({
				status: 500,
				message: 'NG',
			})
		}

		const url = `${req.protocol}://${host}`

		// プッシュ通知で送信したい任意のデータ
		const payload = JSON.stringify({
			title: '[syonet]通知ONにしました',
			body: 'たまに更新しましたら通知いくように頑張ります',
			icon: 'https://avatars3.githubusercontent.com/u/7006562?s=460&v=4',
			url,
		})

		// 購読時に, クライアントサイドから取得したエンドポイント URI に対して POST リクエストを送信
		await webpush.sendNotification(subscription, payload)
		res.status(200)
		return res.send({
			status: 200,
			message: 'OK',
		})
	} catch (error) {
		console.error(error)
		res.status(500)
		return res.send({
			status: 500,
			message: 'NG',
		})
	} finally {
		await dbClose()
	}
}

router.post('/', postWebpush)

export default router
