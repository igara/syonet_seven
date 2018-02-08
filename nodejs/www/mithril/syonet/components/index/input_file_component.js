import {m} from '../../vendor'

/**
 * ファイルのアップロード
 */
export default class InputFileComponent {

	/**
	 * @type {HeaderStore} HeaderStore
	 */
	HeaderStore;

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.HeaderStore = vnode.attrs.HeaderStore
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode 
	 */
	oninit(vnode) {
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				<a href="/analyzeimage" oncreate={m.route.link}>sub</a>
				{this.HeaderStore.s_stream}
				<input type="file" name="datafile" />
			</div>
		)
	}
}
