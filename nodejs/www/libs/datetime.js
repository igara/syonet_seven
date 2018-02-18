const format = require('date-fns/format')
const isDate = require('date-fns/is_date')

/**
 * タイムスタンプ値を取得
 * @return {Number}
 */
const getDateTime = () => {
	return Math.round((new Date()).getTime() / 1000)
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
const getMultiFormatDateTime = (options) => {
	const o = _getMultiFormatDateTimeOptions(options)
	const dt = o.Date
	dt.setSeconds(dt.getSeconds() + o.seconds)
	dt.setMinutes(dt.getMinutes() + o.minutes)
	dt.setHours(dt.getHours() + o.hours)
	dt.setDate(dt.getDate() + o.day)
	dt.setMonth(dt.getMonth() + o.month)
	dt.setFullYear(dt.getFullYear() + o.year)
	return format(dt, o.format)
}

module.exports = {
	getDateTime,
	getMultiFormatDateTime,
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
const _getMultiFormatDateTimeOptions = (options = {}) => {
	options.Date = isDate(options.Date) ? options.Date : new Date()
	options.seconds = isFinite(options.seconds) ? options.seconds : 0
	options.minutes = isFinite(options.minutes) ? options.minutes : 0
	options.hours = isFinite(options.hours) ? options.hours : 0
	options.day = isFinite(options.day) ? options.day : 0
	options.month = isFinite(options.month) ? options.month : 0
	options.year = isFinite(options.year) ? options.year : 0
	options.format = options.format ? options.format : 'YYYY-MM-DD HH:mm:ss'
	return options
}
