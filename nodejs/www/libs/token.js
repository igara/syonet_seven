// @flow
import crypto from 'crypto'
import {getTimeStamp, getMultiFormatDateTime} from './datetime'
import Cookies from '../frontend/syonet/js_cookie'

/**
 * 認証に用いるTokenを取得する
 * @param {String|Number} userId
 * @return {String} token
 */
export const getUserToken = (userId: number | string): string => {
	const value = `${userId}_${getTimeStamp()}`
	const hash = crypto.createHmac('sha512', value)
	hash.update(value)
	const token = hash.digest('hex')
	return token
}

/**
 * 認証に用いるTokenをクッキーから取得する
 * @return {String}
 */
export const getTokenCookie = () => {
	return Cookies.get('auth_token')
}

/**
 * Tokenの値を保存する
 * @param {String} token
 */
export const setTokenCookie = (token: string) => {
	Cookies.set('auth_token', token, {
		expires: new Date(getMultiFormatDateTime({hours: 1})),
	})
}
