// @flow

import Cookies from '../js_cookie'

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

import FetchLogin from '../fetchs/login'

export default async() => {
	if (!location.pathname.match(/^\/login\/check\//)) {
		// ログインチェック
		const sessionId = Cookies.get('connect.sid')
		if (sessionId) {
			const loginCheck = async() => {
				const json = await FetchLogin.callLoginCheck()
				Stores.LoginStore.Status(json.status)
				if (json.status === 200) {
					Stores.LoginStore.User(json.user)
				} else {
					location.href = '/login'
				}
			}
			await loginCheck()
		}
	}

	const routes = {
		'/': new WrapperComponent({
			Stores,
			ChildComponent: IndexPage,
			HeaderTitle: 'Syonet',
		}),
		'/analyzeimage': new WrapperComponent({
			Stores,
			ChildComponent: AnalyzeImagePage,
			HeaderTitle: 'Analyze',
		}),
		'/login': new WrapperComponent({
			Stores,
			ChildComponent: LoginPage,
			HeaderTitle: 'Login',
		}),
		'/login/check': new WrapperComponent({
			Stores,
			ChildComponent: LoginCheckPage,
			HeaderTitle: 'LoginCheck',
		}),
		'/:any': new WrapperComponent({
			Stores,
			ChildComponent: NotFoundPage,
			HeaderTitle: 'Syonet',
		}),
	}
	return routes
}
