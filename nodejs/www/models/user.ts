import { Document, Schema } from 'mongoose'
import mongo from './index'

export interface UserData {
	_id: string
	auth: {
		id: string
		username?: string
		provider: string
		displayName: string
		name?: {
			familyName: string
			givenName: string
		}
		emails?: Array<{
			value: string
			type?: string
		}>
		_json: {
			image?: {
				url: string
				isDefault: boolean
			}
		}
		photos: Array<{
			value: string
		}>
	}
	type: string
}

export interface UserDocument extends Document {
	_id: string
	auth: {
		id: string
		username?: string
		provider: string
		displayName: string
		name?: {
			familyName: string
			givenName: string
		}
		emails?: Array<{
			value: string
			type?: string
		}>
		_json: {
			image?: {
				url: string
			}
		}
		photos: Array<{
			value: string
		}>
	}
	type: string
}

export type UpsertByAuthUserParam = {
	id: string | number
	provider: string
}

export type GetUserInfoReturn = {
	displayName: string
	image: string
}

const UserSchema: Schema = new mongo.Schema(
	{
		auth: mongo.Schema.Types.Mixed,
		type: {
			type: String,
			default: 'general',
		},
	},
	{ collection: 'users' },
)

/**
 * 認証したユーザの情報を更新もしくは新規作成する
 */
export const upsertByAuthUser = async (
	user: UpsertByAuthUserParam,
): Promise<UserDocument | null> => {
	await User.update(
		{ 'auth.id': user.id, 'auth.provider': user.provider },
		{ $set: { auth: user } },
		{ upsert: true, setDefaultsOnInsert: true },
	)
	const findResult = await User.findOne({
		'auth.id': user.id,
		'auth.provider': user.provider,
	}).exec()
	return findResult
}

UserSchema.methods.upsertByAuthUser = upsertByAuthUser

/**
 * 認証したユーザから厳選した情報を取得する
 */
export const getUserInfo = async (
	id: string,
	provider: string,
): Promise<GetUserInfoReturn | null> => {
	const user = await User.findOne({
		'auth.id': id,
		'auth.provider': provider,
	}).exec()
	if (
		typeof user === 'undefined' ||
		user === null ||
		typeof user.auth === 'undefined' ||
		user.auth === null
	) {
		return null
	}
	return {
		displayName: user.auth.displayName,
		image: user.auth.photos[0].value,
	}
}

UserSchema.methods.getUserInfo = getUserInfo

/**
 * 認証したユーザから管理者であるかを取得する
 */
export const getIsAdmin = async (
	id: string,
	provider: string,
): Promise<boolean> => {
	const user = await User.findOne({
		'auth.id': id,
		'auth.provider': provider,
	}).exec()
	if (
		typeof user === 'undefined' ||
		user === null ||
		typeof user.auth === 'undefined' ||
		user.auth === null
	) {
		return false
	}
	if (user.type === 'admin') {
		return true
	}
	return false
}

UserSchema.methods.getIsAdmin = getIsAdmin

/**
 */
export const getUserCount = async (): Promise<number> => {
	const count = await User.count({})
	return count
}

UserSchema.methods.getUserCount = getUserCount

/**
 */
export const getUserList = async (
	offset: number,
	limit: number,
): Promise<Array<UserDocument>> => {
	const userList = await User.find({})
		.skip(offset)
		.limit(limit)
	return userList
}

UserSchema.methods.getUserList = getUserList

const User = mongo.model<UserDocument>('User', UserSchema)
export default User
