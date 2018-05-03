import {m} from '../../mithril'
import HeaderComponent from './header'
import FooterComponent from './footer'
import SidebarComponent from './sidebar'
import {ContentStyle} from '../../styles'

/**
 * 共通のレイアウトを出力する
 */
export default class WrapperComponent {

	/**
	 * @type {Mithril} ChildComponent
	 */
	ChildComponent

	/**
	 * @type {String} HeaderTitle
	 */
	HeaderTitle

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
		this.HeaderTitle = vnode.HeaderTitle
		this.UserAgent = vnode.UserAgent
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode 
	 */
	oninit(vnode) {
		this.Stores.HeaderStore.HeaderTitle(this.HeaderTitle)
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
				{this.Stores.SidebarStore.SidebarDispFlag() ?
					<SidebarComponent
						Stores={this.Stores}
						UserAgent={this.UserAgent}
					/> :
					null
				}
				<div className={ContentStyle.content_wrap_div}>
					<this.ChildComponent
						Stores={this.Stores}
					/>
				</div>
				<FooterComponent
					Stores={this.Stores}
				/>
			</div>
		)
	}
}
