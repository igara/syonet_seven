import {m} from '../vendor'
import HeaderComponent from './common/header_component'

/**
 * Routing URL: //analyzeimage/
 */
export default class AnalyzeImageComponent {

	/**
	 * @type {HeaderStore} HeaderStore
	 */
	HeaderStore;

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.HeaderStore = vnode.HeaderStore
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode 
	 */
	oninit(vnode) {
		this.HeaderStore.header_title_stream('AnalyzeImage')
		this.HeaderStore.s_stream('sasa')
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
				<a href="/" oncreate={m.route.link}>index</a>
				{this.HeaderStore.s_stream}
			</div>
		)
	}
}
