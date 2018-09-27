// @flow

import dateFns from '../frontend/syonet/statics/date_fns'

export type GetMultiFormatDateTimeParamOption = {
	Date?: Date,
	seconds?: number,
	minutes?: number,
	hours?: number,
	day?: number,
	month?: number,
	year?: number,
	format?: string,
}

export type _GetMultiFormatDateTimeReturnOption = {
	Date: Date,
	seconds: number,
	minutes: number,
	hours: number,
	day: number,
	month: number,
	year: number,
	format: string,
}

/**
 * タイムスタンプ値を取得
 * @return {Number}
 */
export const getTimeStamp = () => {
	return Math.round(new Date().getTime() / 1000)
}

/**
 * オプションにあった日付を取得する
 * @param {Date} options.Date 指定日時 default:現在日時（new Date()）
 * @param {Number} options.seconds 追加秒数 default:0
 * @param {Number} options.minutes 追加分数 default:0
 * @param {Number} options.hours 追加時数 default:0
 * @param {Number} options.day 追加日数 default:0
 * @param {Number} options.month 追加月数 default:0
 * @param {Number} options.year 追加年数 default:0
 * @param {String} options.format 日付表示書式 default:'YYYY-MM-DD HH:mm:ss'
 * @return {String} 日付
 */
export const getMultiFormatDateTime = (
	options: ?GetMultiFormatDateTimeParamOption,
) => {
	const o = _getMultiFormatDateTimeOptions(options)
	const dt = o.Date
	dt.setSeconds(dt.getSeconds() + o.seconds)
	dt.setMinutes(dt.getMinutes() + o.minutes)
	dt.setHours(dt.getHours() + o.hours)
	dt.setDate(dt.getDate() + o.day)
	dt.setMonth(dt.getMonth() + o.month)
	dt.setFullYear(dt.getFullYear() + o.year)
	return dateFns.format(dt, o.format)
}

/**
 * getMultiFormatDateTimeのオプションを取得
 * @private
 * @param {Date} options.Date 指定日時 default:現在日時（new Date()）
 * @param {Number} options.seconds 追加秒数 default:0
 * @param {Number} options.minutes 追加分数 default:0
 * @param {Number} options.hours 追加時数 default:0
 * @param {Number} options.day 追加日数 default:0
 * @param {Number} options.month 追加月数 default:0
 * @param {Number} options.year 追加年数 default:0
 * @param {String} options.format 日付表示書式 default:'YYYY-MM-DD HH:mm:ss'
 * @returns {} options
 */
const _getMultiFormatDateTimeOptions = (
	options: ?GetMultiFormatDateTimeParamOption,
): _GetMultiFormatDateTimeReturnOption => {
	if (typeof options === 'undefined' || options === null) {
		options = {
			Date: new Date(),
			seconds: 0,
			minutes: 0,
			hours: 0,
			day: 0,
			month: 0,
			year: 0,
			format: 'YYYY-MM-DD HH:mm:ss',
		}
	}
	if (typeof options.Date === 'undefined' || options.Date === null) {
		options.Date = new Date()
	}
	if (typeof options.seconds === 'undefined' || options.seconds === null) {
		options.seconds = 0
	}
	if (typeof options.minutes === 'undefined' || options.minutes === null) {
		options.minutes = 0
	}
	if (typeof options.hours === 'undefined' || options.hours === null) {
		options.hours = 0
	}
	if (typeof options.day === 'undefined' || options.day === null) {
		options.day = 0
	}
	if (typeof options.month === 'undefined' || options.month === null) {
		options.month = 0
	}
	if (typeof options.year === 'undefined' || options.year === null) {
		options.year = 0
	}
	if (typeof options.format === 'undefined' || options.format === null) {
		options.format = 'YYYY-MM-DD HH:mm:ss'
	}
	return { ...options }
}
