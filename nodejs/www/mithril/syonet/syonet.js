import {m} from './vendor'
import routes from './configs/routes'

window.onload = function() {
	m.route.prefix('')
	m.route(document.body, '/', routes)
}
