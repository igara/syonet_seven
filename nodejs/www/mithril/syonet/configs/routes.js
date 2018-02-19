// Components
import WrapperComponent from '../components/common/wrapper_component'
import IndexComponent from '../components/index_component'
import AnalyzeImageComponent from '../components/analyze_image_component'
import LoginComponent from '../components/login_component'
import LoginCheckComponent from '../components/login_check_component'

// Stores
import HeaderStore from '../stores/common/header_store'
import SidebarStore from '../stores/common/sidebar_store'
import LoginStore from '../stores/common/login_store'

const Stores = {
	HeaderStore,
	SidebarStore,
	LoginStore,
}

import Token from '../../../libs/token'
import FetchLogin from '../fetchs/login'
if (!location.pathname.match(/^\/login\/check\//)) {
	// ログインチェック
	const token = Token.getTokenCookie()
	const loginCheck = async() => {
		const json = await FetchLogin.callLoginCheck(token)
		LoginStore.status(json.status)
		if (json.status === 200) {
			Token.setTokenCookie(token)
		}
	}
	loginCheck()
}

const routes = {
	'/': new WrapperComponent({
		Stores,
		ChildComponent: IndexComponent,
		header_title: 'Syonet',
	}),
	'/analyzeimage': new WrapperComponent({
		Stores,
		ChildComponent: AnalyzeImageComponent,
		header_title: 'Analyze',
	}),
	'/login': new WrapperComponent({
		Stores,
		ChildComponent: LoginComponent,
		header_title: 'Login',
	}),
	'/login/check/:token': new WrapperComponent({
		Stores,
		ChildComponent: LoginCheckComponent,
		header_title: 'LoginCheck',
	}),
}

export default routes
