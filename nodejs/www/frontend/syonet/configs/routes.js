// @flow

// Components
import WrapperComponent from '../components/common/wrapper'

// Pages
import IndexPage from '../pages'
import AnalyzeImageSavePage from '../pages/analyze_image/save'
import LoginPage from '../pages/login'
import LoginCheckPage from '../pages/login_check'
import NotFoundPage from '../pages/not_found'

// Stores
import Stores from '../stores'

export default async () => {
	const routes = {
		'/': new WrapperComponent({
			Stores,
			ChildComponent: IndexPage,
			HeaderTitle: 'Syonet',
		}),
		'/analyze_image/save': new WrapperComponent({
			Stores,
			ChildComponent: AnalyzeImageSavePage,
			HeaderTitle: 'Analyze',
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
