// @flow

import Cookies from '../js_cookie'
import {browser, device} from '../../../libs/useragent'

// Components
import WrapperComponent from '../components/common/wrapper'

// Pages
import IndexPage from '../pages/index'
import AnalyzeImagePage from '../pages/analyze_image'
import LoginPage from '../pages/login'
import LoginCheckPage from '../pages/login_check'
import NotFoundPage from '../pages/not_found'

// Stores
import Stores from '../stores'

import {getTokenCookie, setTokenCookie} from '../../../libs/token'
import FetchLogin from '../fetchs/login'

export default async() => {
	if (!location.pathname.match(/^\/login\/check\//)) {
		// ログインチェック
		const token = getTokenCookie()
		if (token) {
			const loginCheck = async() => {
				const json = await FetchLogin.callLoginCheck(token)
				Stores.LoginStore.Status(json.status)
				if (json.status === 200) {
					setTokenCookie(token)
					Stores.LoginStore.Token(token)
					Stores.LoginStore.User(json.user)
				} else {
					Cookies.remove('auth_token')
					location.href = '/login'
				}
			}
			await loginCheck()
		}
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
			ChildComponent: IndexPage,
			HeaderTitle: 'Syonet',
		}),
		'/analyzeimage': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: AnalyzeImagePage,
			HeaderTitle: 'Analyze',
		}),
		'/login': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: LoginPage,
			HeaderTitle: 'Login',
		}),
		'/login/check/:token': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: LoginCheckPage,
			HeaderTitle: 'LoginCheck',
		}),
		'/:any': new WrapperComponent({
			Stores,
			UserAgent,
			ChildComponent: NotFoundPage,
			HeaderTitle: 'Syonet',
		}),
	}
	return routes
}
