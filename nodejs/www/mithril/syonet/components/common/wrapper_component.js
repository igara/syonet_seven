import {m} from '../../mithril'
import HeaderComponent from './header_component'
import FooterComponent from './footer_component'
import SidebarComponent from './sidebar_component'
import {content_style} from '../../styles'

/**
 * 共通のレイアウトを出力する
 */
export default class WrapperComponent {

	/**
	 * @type {Mithril} ChildComponent
	 */
	ChildComponent

	/**
	 * @type {String} header_title
	 */
	header_title

	/**
	 * @type {browser:{String}, device:{String}} device
	 */
	UserAgent

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.Stores = vnode.Stores
		this.ChildComponent = vnode.ChildComponent
		this.header_title = vnode.header_title
		this.UserAgent = vnode.UserAgent
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode 
	 */
	oninit(vnode) {
		this.Stores.HeaderStore.header_title(this.header_title)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				<HeaderComponent
					Stores={this.Stores}
				/>
				{this.Stores.SidebarStore.sidebar_disp_flag() ?
					<SidebarComponent
						Stores={this.Stores}
						UserAgent={this.UserAgent}
					/> :
					null
				}
				{(() => {
					if (this.UserAgent.device === 'ipad' && this.UserAgent.browser === 'safari') {
						return <div className={content_style.content_wrap_div}>
							<this.ChildComponent
								Stores={this.Stores}
							/>
						</div>
					} else if (this.UserAgent.device === 'iphone' && this.UserAgent.browser === 'safari') {
						return <div className={content_style.content_wrap_div_iphone_safari}>
							<this.ChildComponent
								Stores={this.Stores}
							/>
						</div>
					} else  {
						return <div className={content_style.content_wrap_div}>
							<this.ChildComponent
								Stores={this.Stores}
							/>
						</div>
					}
				})()}
				<FooterComponent
					Stores={this.Stores}
				/>
			</div>
		)
	}
}
