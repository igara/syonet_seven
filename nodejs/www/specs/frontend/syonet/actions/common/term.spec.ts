// @flow

import TermAction from '@F_syonet/actions/common/term'
import Stores from '@F_syonet/stores'

describe('onClickClose', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('TermDispFlag false', async () => {
		const termAction = new TermAction(Stores)
		Stores.TermStore.TermDispFlag(true)
		expect(Stores.TermStore.TermDispFlag()).toBe(true)
		termAction.onClickClose()
		expect(Stores.TermStore.TermDispFlag()).toBe(false)
	})
})
