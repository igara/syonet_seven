/**
 * @flow
 * @jsx m
 */

import { m } from '../../mithril'
import { SidebarStyle, IconStyle } from '../../styles'
import SidebarAction from '../../actions/common/sidebar'
import { sleep } from '../../../../libs/sleep'
import TermComponent from './term'

/**
 * サイドバーを表示するコンポーネント
 */
export default class SidebarComponent {
	Stores: Stores

	/**
	 * @type {SidebarAction} SidebarAction
	 */
	SidebarAction: SidebarAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: SidebarComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.SidebarAction = new SidebarAction(this.Stores)
	}

	/**
	 * Lifecycle: The onbeforeupdate hook is called before a vnode is diffed in a update.
	 * @param {Vnode<A, this>} vnode
	 */
	async onbeforeremove(vnode: SidebarComponentVnode) {
		vnode.dom.classList.add(SidebarStyle.sidebar_exit)
		return await sleep(1000)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={SidebarStyle.sidebar_wrap_div}>
				<div class={SidebarStyle.sidebar_overlay_div} />
				<ul class={SidebarStyle.sidebar_link_wrap_ul}>
					<li
						class={SidebarStyle.sidebar_link_list}
						onclick={() => this.SidebarAction.onClickClose()}
					>
						<a>閉じる</a>
					</li>
					<li
						class={SidebarStyle.sidebar_link_list}
						onclick={(event: Event) => this.SidebarAction.onClickHome(m, event)}
					>
						<a href="/">ホーム</a>
					</li>
					{this.Stores.LoginStore.User() ? (
						<li
							class={SidebarStyle.sidebar_link_list}
							onclick={() => this.SidebarAction.onClickLogout(m)}
						>
							<a>ログアウト</a>
						</li>
					) : (
						<li
							class={SidebarStyle.sidebar_link_list}
							onclick={(event: Event) =>
								this.SidebarAction.onClickLogin(m, event)
							}
						>
							<a href="/login">ログイン</a>
						</li>
					)}
					<li
						class={SidebarStyle.sidebar_link_list}
						onclick={() => this.SidebarAction.onClickTerm()}
					>
						<a>利用規約</a>
					</li>
					<li class={SidebarStyle.sidebar_link_list}>
						<a>ライセンス</a>
					</li>
					<li class={SidebarStyle.sidebar_link_list}>
						<a href="https://github.com/igara/syonet_seven" target="_blank">
							GitHub
						</a>
					</li>
				</ul>
				<button
					class={IconStyle.Close.close_icon}
					onclick={() => this.SidebarAction.onClickClose()}
				>
					<div class={IconStyle.Close.close_mark} />
				</button>
				{this.Stores.TermStore.TermDispFlag() ? (
					<TermComponent Stores={this.Stores} />
				) : null}
			</div>
		)
	}
}
