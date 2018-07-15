// @flow

import HeaderStore from './common/header'
import SidebarStore from './common/sidebar'
import LoginStore from './common/login'
import TermStore from './common/term'
import TensorflowAnalyzeImageStore from './tensorflowjs/analyze_image'
import KerasAnalyzeImageStore from './kerasjs/analyze_image'

const Stores = {
	HeaderStore,
	SidebarStore,
	LoginStore,
	TermStore,
	TensorflowAnalyzeImageStore,
	KerasAnalyzeImageStore,
}

export default Stores
