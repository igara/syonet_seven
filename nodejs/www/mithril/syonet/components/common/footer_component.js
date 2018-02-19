import {m} from '../../vendor'
import FooterAction from '../../actions/common/footer_action'
import footer_style from '../../styles/common/footer.scss'

/**
 * フッダーを表示するコンポーネント
 */
export default class FooterComponent {

	/**
	 * @type {Stores} Stores
	 */
	Stores

	/**
	 * @type {FooterAction} FooterAction
	 */
	FooterAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.Stores = vnode.attrs.Stores
		this.FooterAction = new FooterAction(this.Stores.SidebarStore)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={footer_style.footer_wrap_div}>
				<div>
					<a onclick={() => this.FooterAction.onClickLinkIcon()}>
						aaaaa
					</a>
				</div>
			</div>
		)
	}
}
