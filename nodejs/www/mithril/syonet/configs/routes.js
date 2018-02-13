// Components
import WrapperComponent from '../components/common/wrapper_component'
import IndexComponent from '../components/index_component'
import AnalyzeImageComponent from '../components/analyze_image_component'
import LoginComponent from '../components/login_component'

// Stores
import HeaderStore from '../stores/common/header_store'
import SidebarStore from '../stores/common/sidebar_store'

const routes = {
	'/': new WrapperComponent({
		HeaderStore,
		SidebarStore,
		ChildComponent: IndexComponent,
		header_title: 'Syonet',
	}),
	'/analyzeimage': new WrapperComponent({
		HeaderStore,
		SidebarStore,
		ChildComponent: AnalyzeImageComponent,
		header_title: 'Analyze',
	}),
	'/login': new WrapperComponent({
		HeaderStore,
		SidebarStore,
		ChildComponent: LoginComponent,
		header_title: 'Login',
	}),
}

export default routes
