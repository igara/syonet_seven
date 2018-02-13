import {m} from './vendor'
import routes from './configs/routes'

window.onload = () => {
	m.route.prefix('')
	m.route(document.body, '/', routes)
}
