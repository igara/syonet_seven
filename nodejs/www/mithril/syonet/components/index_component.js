import {m} from '../vendor'
import HeaderComponent from './common/header_component'
import FooterComponent from './common/footer_component'
import SidebarComponent from './common/sidebar_component'
import InputFileComponent from './index/input_file_component'
import content_style from '../styles/common/content.scss'

/**
 * Routing URL: //index/
 */
export default class IndexComponent {

	/**
	 * @type {HeaderStore} HeaderStore
	 */
	HeaderStore;

	/**
	 * @type {SidebarStore} SidebarStore
	 */
	SidebarStore;

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.HeaderStore = vnode.HeaderStore
		this.SidebarStore = vnode.SidebarStore
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode 
	 */
	oninit(vnode) {
		this.HeaderStore.header_title_stream('Syonet')
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				<HeaderComponent
					HeaderStore={this.HeaderStore}
				/>
				{this.SidebarStore.sidebar_disp_flag_stream() ?
					<SidebarComponent
						SidebarStore={this.SidebarStore}
					/> :
					null
				}
				<div className={content_style.content_wrap_div}>
				<InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/><InputFileComponent
					HeaderStore={this.HeaderStore}
				/><InputFileComponent
				HeaderStore={this.HeaderStore}
			/><InputFileComponent
			HeaderStore={this.HeaderStore}
		/><InputFileComponent
		HeaderStore={this.HeaderStore}
	/><InputFileComponent
	HeaderStore={this.HeaderStore}
/><InputFileComponent
						HeaderStore={this.HeaderStore}
					/>っっっっc
				</div>
				<FooterComponent
					SidebarStore={this.SidebarStore}
				/>
			</div>
		)
	}
}
