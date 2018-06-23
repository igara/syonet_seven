// @flow

import Stores from '../../../../../frontend/syonet/stores'
import { m } from '../../../../../frontend/syonet/statics/mithril'

describe('onClickClose', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('SidebarDispFlag false', async () => {
		const SidebarAction = require('../../../../../frontend/syonet/actions/common/sidebar')
			.default
		const sidebarAction = new SidebarAction(Stores)
		Stores.SidebarStore.SidebarDispFlag(true)
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(true)
		sidebarAction.onClickClose()
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(false)
	})
})

describe('onClickTerm', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('TermDispFlag false', async () => {
		const SidebarAction = require('../../../../../frontend/syonet/actions/common/sidebar')
			.default
		const sidebarAction = new SidebarAction(Stores)
		expect(Stores.TermStore.TermDispFlag()).toBe(false)
		sidebarAction.onClickTerm()
		expect(Stores.TermStore.TermDispFlag()).toBe(true)
	})
})

describe('onClickHome', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('home click', async () => {
		jest.doMock('../../../../../libs/sleep', () => ({
			sleep: jest.fn(),
		}))
		const SidebarAction = require('../../../../../frontend/syonet/actions/common/sidebar')
			.default
		const sidebarAction = new SidebarAction(Stores)
		Stores.SidebarStore.SidebarDispFlag(true)
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(true)

		const buttonElement = document.createElement('button')
		buttonElement.addEventListener('click', async (event: Event) => {
			await sidebarAction.onClickHome(m, event)
		})
		await buttonElement.dispatchEvent(new Event('click'))
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(false)
	})
})

describe('onClickLogin', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('login click', async () => {
		jest.doMock('../../../../../libs/sleep', () => ({
			sleep: jest.fn(),
		}))
		const SidebarAction = require('../../../../../frontend/syonet/actions/common/sidebar')
			.default
		const sidebarAction = new SidebarAction(Stores)

		Stores.SidebarStore.SidebarDispFlag(true)
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(true)

		const buttonElement = document.createElement('button')
		buttonElement.addEventListener('click', async (event: Event) => {
			sidebarAction.onClickLogin(m, event)
		})
		await buttonElement.dispatchEvent(new Event('click'))
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(false)
	})
})

describe('onClickLogout', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('logout click', async () => {
		jest.doMock('../../../../../frontend/syonet/fetchs/login', () => ({
			callLogout: jest.fn(),
		}))
		jest.doMock('../../../../../frontend/syonet/statics/js_cookie', () => ({
			remove: jest.fn(),
		}))
		jest.doMock('../../../../../libs/sleep', () => ({
			sleep: jest.fn(),
		}))
		const SidebarAction = require('../../../../../frontend/syonet/actions/common/sidebar')
			.default
		const sidebarAction = new SidebarAction(Stores)

		Stores.SidebarStore.SidebarDispFlag(true)
		Stores.LoginStore.User({ id: 1 })
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(true)
		expect(Stores.LoginStore.User()).toEqual({ id: 1 })

		const buttonElement = document.createElement('button')
		buttonElement.addEventListener('click', async () => {
			await sidebarAction.onClickLogout(m)
		})
		await buttonElement.dispatchEvent(new Event('click'))
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(false)
		expect(Stores.LoginStore.User()).toBe('')
	})
})
