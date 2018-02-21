import Cookies from '../js_cookie'
import {browser, device} from '../../../libs/useragent'

// Components
import WrapperComponent from '../components/common/wrapper_component'
import IndexComponent from '../components/index_component'
import AnalyzeImageComponent from '../components/analyze_image_component'
import LoginComponent from '../components/login_component'
import LoginCheckComponent from '../components/login_check_component'
import NotFoundComponent from '../components/not_found_component'

// Stores
import HeaderStore from '../stores/common/header_store'
import SidebarStore from '../stores/common/sidebar_store'
import LoginStore from '../stores/common/login_store'

import Token from '../../../libs/token'
import FetchLogin from '../fetchs/login'

export default async() => {
	if (!location.pathname.match(/^\/login\/check\//)) {
		// ログインチェック
		const token = Token.getTokenCookie()
		if (token) {
			const loginCheck = async() => {
				const json = await FetchLogin.callLoginCheck(token)
				LoginStore.status(json.status)
				if (json.status === 200) {
					Token.setTokenCookie(token)
					LoginStore.token(token)
					LoginStore.user(json.user)
				} else {
					Cookies.remove('auth_token')
					location.href = '/login'
				}
			}
			await loginCheck()
		}
	}

	const Stores = {
		HeaderStore,
		SidebarStore,
		LoginStore,
	}

	const resultDevice = device()
	const resultBrowser = browser()
	const UserAgent = {
		browser: resultBrowser,
		device: resultDevice,
	}

	const routes = {
		'/': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: IndexComponent,
			header_title: 'Syonet',
		}),
		'/analyzeimage': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: AnalyzeImageComponent,
			header_title: 'Analyze',
		}),
		'/login': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: LoginComponent,
			header_title: 'Login',
		}),
		'/login/check/:token': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: LoginCheckComponent,
			header_title: 'LoginCheck',
		}),
		'/:any': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: NotFoundComponent,
			header_title: 'Syonet',
		}),
	}
	return routes
}
