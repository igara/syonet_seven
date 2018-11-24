// @flow

// Components
import WrapperComponent from '@F_syonet/components/common/wrapper'

// Pages
import IndexPage from '@F_syonet/pages'
import ToolsPage from '@F_syonet/pages/tools'
import AnalyzeImageListPage from '@F_syonet/pages/tools/analyze_image/list'
import AnalyzeImageLoadPage from '@F_syonet/pages/tools/analyze_image/load'
import AnalyzeImageSavePage from '@F_syonet/pages/tools/analyze_image/save'
import LoginPage from '@F_syonet/pages/login'
import LoginCheckPage from '@F_syonet/pages/login_check'
import NotFoundPage from '@F_syonet/pages/not_found'

// Stores
import Stores from '@F_syonet/stores'

import Cookies from '@F_syonet/statics/js_cookie'
import { callLoginCheck } from '@F_syonet/fetchs/login'
import { callAnalyzeImageList } from '@F_syonet/fetchs/github'

/**
 * ログインチェック
 */
const checkAuth = async () => {
	const sessionId = Cookies.get('connect.sid')
	if (sessionId) {
		const json = await callLoginCheck()
		Stores.LoginStore.Status(json.status)
		if (json.status === 200) {
			Stores.LoginStore.User(json.user)
		}
	}
}

/**
 * 画像解析一覧を取得をおこなう
 */
const setAnalyzeImageList = async () => {
	const json = await callAnalyzeImageList()
	Stores.AnalyzeImageListStore.List(json)
}

export default async () => {
	await Promise.all([
		checkAuth().catch(console.error),
		setAnalyzeImageList().catch(console.error),
	])
	const routes = {
		'/': new WrapperComponent({
			Stores,
			ChildComponent: IndexPage,
			HeaderTitle: 'Top',
		}),
		'/tools': new WrapperComponent({
			Stores,
			ChildComponent: ToolsPage,
			HeaderTitle: 'Tools',
		}),
		'/tools/analyze_image': new WrapperComponent({
			Stores,
			ChildComponent: AnalyzeImageListPage,
			HeaderTitle: '作成した画像解析一覧',
		}),
		'/tools/analyze_image/load/:sha': new WrapperComponent({
			Stores,
			ChildComponent: AnalyzeImageLoadPage,
			HeaderTitle: '画像解析読み込み画面',
		}),
		'/tools/analyze_image/save': new WrapperComponent({
			Stores,
			ChildComponent: AnalyzeImageSavePage,
			HeaderTitle: '画像解析保存画面',
			// Auth: true,
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
