// @flow

import HeaderStore from './common/header'
import SidebarStore from './common/sidebar'
import LoginStore from './common/login'
import TermStore from './common/term'
import AnalyzeImageSaveStore from './analyze_image/save'
import AnalyzeImageListStore from './analyze_image/list'
import AnalyzeImageLoadStore from './analyze_image/load'
import VotingStore from './voting'

import type { HeaderStoreType } from './common/header'
import type { SidebarStoreType } from './common/sidebar'
import type { LoginStoreType } from './common/login'
import type { TermStoreType } from './common/term'
import type { AnalyzeImageSaveStoreType } from './analyze_image/save'
import type { AnalyzeImageListStoreType } from './analyze_image/list'
import type { AnalyzeImageLoadStoreType } from './analyze_image/load'
import type { VotingStoreType } from './voting'

export type StoresType = HeaderStoreType &
	SidebarStoreType &
	LoginStoreType &
	TermStoreType &
	AnalyzeImageSaveStoreType &
	AnalyzeImageListStoreType &
	AnalyzeImageLoadStoreType &
	VotingStoreType

const Stores = {
	HeaderStore,
	SidebarStore,
	LoginStore,
	TermStore,
	AnalyzeImageSaveStore,
	AnalyzeImageListStore,
	AnalyzeImageLoadStore,
	VotingStore,
}

export default Stores
