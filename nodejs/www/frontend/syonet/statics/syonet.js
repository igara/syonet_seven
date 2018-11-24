// @flow

import { m } from './mithril'
import routes from '@F_syonet/configs/routes'

window.onload = async () => {
	m.route.prefix('')
	m.route(document.body, '/', await routes())
}
