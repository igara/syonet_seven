// @flow

import {getMultiFormatDateTime, getTimeStamp} from '../../../libs/datetime'
import dateFns from '../../../frontend/syonet/date_fns'

const DateInstance = Date

class MockDate extends DateInstance {
	dateInstance = new DateInstance()
	constructor(arg) {
		super()
		if (arg) {
			this.dateInstance = new DateInstance(arg)
		} else {
			this.dateInstance = new DateInstance('2018/11/11 11:11:11')
		}
	}
	getSeconds() {
		return this.dateInstance.getSeconds()
	}
	setSeconds(num: number) {
		this.dateInstance.setSeconds(num)
		return this.dateInstance.getSeconds()
	}
	getMinutes() {
		return this.dateInstance.getMinutes()
	}
	setMinutes(num) {
		this.dateInstance.setMinutes(num)
		return this.dateInstance.getMinutes()
	}
	getHours() {
		return this.dateInstance.getHours()
	}
	setHours(num) {
		this.dateInstance.setHours(num)
		return this.dateInstance.getHours()
	}
	getDate() {
		return this.dateInstance.getDate()
	}
	setDate(num) {
		this.dateInstance.setDate(num)
		return this.dateInstance.getDate()
	}
	getMonth() {
		return this.dateInstance.getMonth()
	}
	setMonth(num) {
		this.dateInstance.setMonth(num)
		return this.dateInstance.getMonth()
	}
	getFullYear() {
		return this.dateInstance.getFullYear()
	}
	setFullYear(num) {
		this.dateInstance.setFullYear(num)
		return this.dateInstance.getFullYear()
	}
	getTime() {
		return new DateInstance(`${this.getFullYear()}-${this.getMonth()}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`).getTime()
	}
	valueOf() {
		return new DateInstance(`${this.getFullYear()}-${this.getMonth()}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`).valueOf()
	}
}

describe('getTimeStamp', () => {
	beforeEach(() => {
		jest.resetModules()
		global.Date = DateInstance
	})
	test('Date 2018/11/11 11:11:11', async () => {
		const date = new Date('2018/11/11 11:11:11')
		global.Date = () => date
		expect(getTimeStamp()).toBe(Math.round((date).getTime() / 1000))
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
		expect(getMultiFormatDateTime()).toBe('2018-10-11 11:11:11')
	})

	test('Date 2018/11/11 11:11:11 format', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			format: 'YYYY/MM/DD HH:mm:ss',
		}
		expect(getMultiFormatDateTime(option)).toBe('2018/10/11 11:11:11')
		option = {
			format: 'YYYY年MM月DD日 HH時mm分ss秒',
		}
		expect(getMultiFormatDateTime(option)).toBe('2018年10月11日 11時11分11秒')
	})

	test('Date 2018-11-11 11:11:11 seconds', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			seconds: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 11:11:10')
		option = {
			seconds: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 11:11:12')
		option = {
			seconds: -60,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 11:10:11')
		option = {
			seconds: 60,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 11:12:11')
	})

	test('Date 2018-11-11 11:11:11 minutes', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			minutes: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 11:10:11')
		option = {
			minutes: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 11:12:11')
		option = {
			minutes: -60,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 10:11:11')
		option = {
			minutes: 60,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 12:11:11')
	})

	test('Date 2018-11-11 11:11:11 hours', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			hours: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 10:11:11')
		option = {
			hours: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-11 12:11:11')
		option = {
			hours: -24,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-10 11:11:11')
		option = {
			hours: 24,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-12 11:11:11')
	})

	test('Date 2018-11-11 11:11:11 date', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			day: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-10 11:11:11')
		option = {
			day: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-10-12 11:11:11')
		option = {
			day: -30,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-09-12 11:11:11')
		option = {
			day: 30,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 11:11:11')
	})

	test('Date 2018-11-11 11:11:11 month', async () => {
		global.Date = MockDate
		global.dateFns = dateFns
		let option = {
			month: -1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-09-11 11:11:11')
		option = {
			month: 1,
		}
		expect(getMultiFormatDateTime(option)).toBe('2018-11-11 11:11:11')
		option = {
			month: -12,
		}
		expect(getMultiFormatDateTime(option)).toBe('2017-10-11 11:11:11')
		option = {
			month: 12,
		}
		expect(getMultiFormatDateTime(option)).toBe('2019-10-11 11:11:11')
	})
})