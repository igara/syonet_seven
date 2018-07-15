// @flow

// Components
import WrapperComponent from '../components/common/wrapper'

// Pages
import IndexPage from '../pages'
import TensorflowAnalyzeImagePage from '../pages/tensorflowjs/analyze_image'
import KerasAnalyzeImagePage from '../pages/kerasjs/analyze_image'
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
		'/tensorflow/analyze_image': new WrapperComponent({
			Stores,
			ChildComponent: TensorflowAnalyzeImagePage,
			HeaderTitle: 'Analyze',
			// Auth: true,
		}),
		'/keras/analyze_image': new WrapperComponent({
			Stores,
			ChildComponent: KerasAnalyzeImagePage,
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
