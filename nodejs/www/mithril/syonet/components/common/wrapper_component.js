import {m} from '../../vendor'
import HeaderComponent from './header_component'
import FooterComponent from './footer_component'
import SidebarComponent from './sidebar_component'
import content_style from '../../styles/common/content.scss'

/**
 * 共通のレイアウトを出力する
 */
export default class WrapperComponent {

	/**
	 * @type {HeaderStore} HeaderStore
	 */
	HeaderStore

	/**
	 * @type {SidebarStore} SidebarStore
	 */
	SidebarStore

	/**
	 * @type {Mithril} ChildComponent
	 */
	ChildComponent

	/**
	 * @type {String} header_title
	 */
	header_title

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.HeaderStore = vnode.HeaderStore
		this.SidebarStore = vnode.SidebarStore
		this.ChildComponent = vnode.ChildComponent
		this.header_title = vnode.header_title
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode 
	 */
	oninit(vnode) {
		this.HeaderStore.header_title(this.header_title)
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
				{this.SidebarStore.sidebar_disp_flag() ?
					<SidebarComponent
						SidebarStore={this.SidebarStore}
					/> :
					null
				}
				<div className={content_style.content_wrap_div}>
					<this.ChildComponent
						HeaderStore={this.HeaderStore}
						SidebarStore={this.SidebarStore}
					/>
				</div>
				<FooterComponent
					SidebarStore={this.SidebarStore}
				/>
			</div>
		)
	}
}
