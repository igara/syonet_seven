// @flow

import FooterAction from '@F_syonet/actions/common/footer'
import Stores from '@F_syonet/stores'

describe('onClickLinkIcon', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('SidebarDispFlag true', async () => {
		const footerAction = new FooterAction(Stores)
		Stores.SidebarStore.SidebarDispFlag(false)
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(false)
		footerAction.onClickLinkIcon()
		expect(Stores.SidebarStore.SidebarDispFlag()).toBe(true)
	})
})
