// @flow

export const DateInstance = Date

export class MockDate extends DateInstance {
	dateInstance = new DateInstance()
	constructor(arg: string) {
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
	setMinutes(num: number) {
		this.dateInstance.setMinutes(num)
		return this.dateInstance.getMinutes()
	}
	getHours() {
		return this.dateInstance.getHours()
	}
	setHours(num: number) {
		this.dateInstance.setHours(num)
		return this.dateInstance.getHours()
	}
	getDate() {
		return this.dateInstance.getDate()
	}
	setDate(num: number) {
		this.dateInstance.setDate(num)
		return this.dateInstance.getDate()
	}
	getMonth() {
		return this.dateInstance.getMonth()
	}
	setMonth(num: number) {
		this.dateInstance.setMonth(num)
		return this.dateInstance.getMonth()
	}
	getFullYear() {
		return this.dateInstance.getFullYear()
	}
	setFullYear(num: number) {
		this.dateInstance.setFullYear(num)
		return this.dateInstance.getFullYear()
	}
	getTime() {
		return new DateInstance(`${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`).getTime()
	}
	valueOf() {
		return new DateInstance(`${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`).valueOf()
	}
}
