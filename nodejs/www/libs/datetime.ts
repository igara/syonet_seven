import * as dateFns from "date-fns";

export interface GetMultiFormatDateTimeParamOption {
	Date?: Date;
	seconds?: number;
	minutes?: number;
	hours?: number;
	day?: number;
	month?: number;
	year?: number;
	format?: string;
}

export interface _GetMultiFormatDateTimeReturnOption {
	Date: Date;
	seconds: number;
	minutes: number;
	hours: number;
	day: number;
	month: number;
	year: number;
	format: string;
}

/**
 * タイムスタンプ値を取得
 * @return {Number}
 */
export const getTimeStamp = () => {
	return Math.round(new Date().getTime() / 1000);
};

/**
 * オプションにあった日付を取得する
 */
export const getMultiFormatDateTime = (
	options: GetMultiFormatDateTimeParamOption
) => {
	const o = _getMultiFormatDateTimeOptions(options);
	const dt = o.Date;
	dt.setSeconds(dt.getSeconds() + o.seconds);
	dt.setMinutes(dt.getMinutes() + o.minutes);
	dt.setHours(dt.getHours() + o.hours);
	dt.setDate(dt.getDate() + o.day);
	dt.setMonth(dt.getMonth() + o.month);
	dt.setFullYear(dt.getFullYear() + o.year);
	return dateFns.format(dt.toUTCString(), o.format);
};

/**
 * getMultiFormatDateTimeのオプションを取得
 */
const _getMultiFormatDateTimeOptions = (
	options: GetMultiFormatDateTimeParamOption
): _GetMultiFormatDateTimeReturnOption => {
	let newOptions: _GetMultiFormatDateTimeReturnOption = {
		Date: new Date(),
		seconds: 0,
		minutes: 0,
		hours: 0,
		day: 0,
		month: 0,
		year: 0,
		format: "YYYY-MM-DD HH:mm:ss"
	};
	if (options.Date instanceof Date) {
		newOptions.Date = options.Date;
	}
	if (typeof options.seconds === "number") {
		newOptions.seconds = options.seconds;
	}
	if (typeof options.minutes === "number") {
		newOptions.minutes = options.minutes;
	}
	if (typeof options.hours === "number") {
		newOptions.hours = options.hours;
	}
	if (typeof options.day === "number") {
		newOptions.day = options.day;
	}
	if (typeof options.month === "number") {
		newOptions.month = options.month;
	}
	if (typeof options.year === "number") {
		newOptions.year = options.year;
	}
	if (typeof options.format === "string") {
		newOptions.format = options.format;
	}
	return newOptions;
};
