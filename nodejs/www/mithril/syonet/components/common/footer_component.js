import {m} from '../../vendor'
import FooterAction from '../../actions/common/footer_action'
import footer_style from '../../styles/common/footer.scss'

/**
 * フッダーを表示するコンポーネント
 */
export default class FooterComponent {

	/**
	 * @type {SidebarStore} SidebarStore
	 */
	SidebarStore;

	/**
	 * @type {FooterAction} FooterAction
	 */
	FooterAction;

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.SidebarStore = vnode.attrs.SidebarStore
		this.FooterAction = new FooterAction(this.SidebarStore)
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
