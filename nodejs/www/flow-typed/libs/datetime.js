// @flow

export type GetMultiFormatDateTimeParamOption = {
	Date?: Date,
	seconds?: number,
	minutes?: number,
	hours?: number,
	day?: number,
	month?: number,
	year?: number,
	format?: string
}

export type _GetMultiFormatDateTimeReturnOption = {
	Date: Date,
	seconds: number,
	minutes: number,
	hours: number,
	day: number,
	month: number,
	year: number,
	format: string
}