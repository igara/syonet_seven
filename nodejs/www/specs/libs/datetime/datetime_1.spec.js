// @flow

import { getMultiFormatDateTime, getTimeStamp } from '../../../libs/datetime'
import dateFns from '../../../frontend/syonet/statics/date_fns'

import { DateInstance, MockDate } from '../../globals/date'

describe('getTimeStamp', () => {
	beforeEach(() => {
		jest.resetModules()
		global.Date = DateInstance
	})
	test('Date 2018/11/11 11:11:11', async () => {
		const date = new Date('2018/11/11 11:11:11')
		global.Date = () => date
		expect(getTimeStamp()).toBe(Math.round(date.getTime() / 1000))
	})
})

describe('getMultiFormatDateTime', () => {
	beforeEach(() => {
		jest.resetModules()
		global.Date = DateInstance
	})

	test('Date 2018-11-11 11:11:11', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		expect(getMultiFormatDateTime()).toBe('2018-11-11 11:11:11')
	})

	test('Date 2018/11/11 11:11:11 format', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			format: 'YYYY/MM/DD HH:mm:ss',
		}
		expect(getMultiFormatDateTime(option)).toBe('2018/11/11 11:11:11')
		option = {
			format: 'YYYY年MM月DD日 HH時mm分ss秒',
		}
		expect(getMultiFormatDateTime(option)).toBe('2018年11月11日 11時11分11秒')
	})

	test('Date 2018-11-11 11:11:11 seconds', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			seconds: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 11:11:10')
		option = {
			seconds: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 11:11:12')
		option = {
			seconds: -60,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 11:10:11')
		option = {
			seconds: 60,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 11:12:11')
	})

	test('Date 2018-11-11 11:11:11 minutes', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			minutes: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 11:10:11')
		option = {
			minutes: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 11:12:11')
		option = {
			minutes: -60,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 10:11:11')
		option = {
			minutes: 60,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 12:11:11')
	})

	test('Date 2018-11-11 11:11:11 hours', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			hours: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 10:11:11')
		option = {
			hours: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 12:11:11')
		option = {
			hours: -24,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-10 11:11:11')
		option = {
			hours: 24,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-12 11:11:11')
	})

	test('Date 2018-11-11 11:11:11 date', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			day: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-10 11:11:11')
		option = {
			day: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-12 11:11:11')
		option = {
			day: -30,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-12 11:11:11')
		option = {
			day: 30,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-12-11 11:11:11')
	})

	test('Date 2018-11-11 11:11:11 month', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			month: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 11:11:11')
		option = {
			month: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-12-11 11:11:11')
		option = {
			month: -12,
		}
		expect(getMultiFormatDateTime(option)).toBe('2017-11-11 11:11:11')
		option = {
			month: 12,
		}
		expect(getMultiFormatDateTime(option)).toBe('2019-11-11 11:11:11')
	})
})
