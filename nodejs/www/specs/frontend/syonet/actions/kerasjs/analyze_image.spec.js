// @flow

import Stores from '../../../../../frontend/syonet/stores'
import { m } from '../../../../../frontend/syonet/statics/mithril'

describe('onInputModelName', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('changed', async () => {
		Stores.KerasAnalyzeImageStore.ModelName('')
		expect(Stores.KerasAnalyzeImageStore.ModelName()).toBe('')

		const AnalyzeImageAction = require('../../../../../frontend/syonet/actions/kerasjs/analyze_image')
			.default
		const analyzeImageAction = new AnalyzeImageAction(Stores)
		const inputTextElement = document.createElement('input')
		inputTextElement.type = 'text'
		// $FlowFixMe
		inputTextElement.addEventListener(
			'change',
			async (event: SyntheticInputEvent<HTMLInputElement>) => {
				event.target.value = 'test'
				await analyzeImageAction.onInputModelName(event)
			},
		)
		await inputTextElement.dispatchEvent(new Event('change'))
		expect(Stores.KerasAnalyzeImageStore.ModelName()).toBe('test')
	})
})

describe('onClickAddCategory', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('clicked', async () => {
		Stores.KerasAnalyzeImageStore.Category([])
		expect(Stores.KerasAnalyzeImageStore.Category()).toEqual([])

		const AnalyzeImageAction = require('../../../../../frontend/syonet/actions/kerasjs/analyze_image')
			.default
		const analyzeImageAction = new AnalyzeImageAction(Stores)
		const buttonElement = document.createElement('button')
		buttonElement.addEventListener('click', async () => {
			await analyzeImageAction.onClickAddCategory()
		})
		await buttonElement.dispatchEvent(new Event('click'))
		expect(Stores.KerasAnalyzeImageStore.Category()).toEqual([
			{
				id: 0,
				name: '無題0',
				images: [],
			},
		])
	})
})

describe('onClickCategoryName', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('clicked', async () => {
		Stores.KerasAnalyzeImageStore.SelectedCategoryID(4)
		expect(Stores.KerasAnalyzeImageStore.SelectedCategoryID()).toBe(4)
	})
})

describe('onInputCategoryName', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('changed', async () => {
		Stores.KerasAnalyzeImageStore.Category([
			{
				id: 0,
				name: '',
				images: [],
			},
		])
		expect(Stores.KerasAnalyzeImageStore.Category()).toEqual([
			{
				id: 0,
				name: '',
				images: [],
			},
		])

		const AnalyzeImageAction = require('../../../../../frontend/syonet/actions/kerasjs/analyze_image')
			.default
		const analyzeImageAction = new AnalyzeImageAction(Stores)
		const inputTextElement = document.createElement('input')
		inputTextElement.type = 'text'
		// $FlowFixMe
		inputTextElement.addEventListener(
			'change',
			async (event: SyntheticInputEvent<HTMLInputElement>) => {
				event.target.value = 'test'
				await analyzeImageAction.onInputCategoryName(event, 0)
			},
		)
		await inputTextElement.dispatchEvent(new Event('change'))
		expect(Stores.KerasAnalyzeImageStore.Category()).toEqual([
			{
				id: 0,
				name: 'test',
				images: [],
			},
		])
	})

	test('対象のidがない時', async () => {
		Stores.KerasAnalyzeImageStore.Category([
			{
				id: 1,
				name: '',
				images: [],
			},
		])
		expect(Stores.KerasAnalyzeImageStore.Category()).toEqual([
			{
				id: 1,
				name: '',
				images: [],
			},
		])

		const AnalyzeImageAction = require('../../../../../frontend/syonet/actions/kerasjs/analyze_image')
			.default
		const analyzeImageAction = new AnalyzeImageAction(Stores)
		const inputTextElement = document.createElement('input')
		inputTextElement.type = 'text'
		// $FlowFixMe
		inputTextElement.addEventListener(
			'change',
			async (event: SyntheticInputEvent<HTMLInputElement>) => {
				event.target.value = 'test'
				await analyzeImageAction.onInputCategoryName(event, 0)
			},
		)
		await inputTextElement.dispatchEvent(new Event('change'))
		expect(Stores.KerasAnalyzeImageStore.Category()).toEqual([
			{
				id: 1,
				name: '',
				images: [],
			},
		])
	})
})

describe('onInputCategoryFile', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	// test('changed', async () => {
	// 	Stores.AnalyzeImageStore.Category([
	// 		{
	// 			id: 0,
	// 			name: '',
	// 			images: [],
	// 		},
	// 	])
	// 	expect(Stores.AnalyzeImageStore.Category()).toEqual([
	// 		{
	// 			id: 0,
	// 			name: '',
	// 			images: [],
	// 		},
	// 	])

	// 	const AnalyzeImageAction = require('../../../../../frontend/syonet/actions/tensorflowjs/analyze_image')
	// 		.default
	// 	const analyzeImageAction = new AnalyzeImageAction(Stores)
	// 	// $FlowFixMe
	// 	const e = {
	// 		target: {
	// 			files: {
	// 				length: 1,
	// 				'0': new File(['data:image/png;base64,a'], '', {
	// 					type: 'image/png',
	// 				}),
	// 			},
	// 		},
	// 	}
	// 	await analyzeImageAction.onInputCategoryFile(e, 0, m)
	// 	expect(Stores.AnalyzeImageStore.Category()).toEqual([
	// 		{
	// 			id: 0,
	// 			name: '',
	// 			images: ['data:image/png;base64,ZGF0YTppbWFnZS9wbmc7YmFzZTY0LGE='],
	// 		},
	// 	])
	// })
})

describe('readUploadedFileAsText', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	// test('successed get base64 string', async () => {
	// 	const file = new File(['data:image/png;base64,a'], '', {
	// 		type: 'image/png',
	// 	})
	// 	const AnalyzeImageAction = require('../../../../../frontend/syonet/actions/tensorflowjs/analyze_image')
	// 		.default
	// 	const analyzeImageAction = new AnalyzeImageAction(Stores)
	// 	const result = await analyzeImageAction.readUploadedFileAsText(file)
	// 	expect(result).toBe(
	// 		'data:image/png;base64,ZGF0YTppbWFnZS9wbmc7YmFzZTY0LGE=',
	// 	)
	// })

	// test('successed get base64 string before ArrayBuffer', async () => {
	// 	const file = new File([new ArrayBuffer(10)], '', {
	// 		type: 'image/png',
	// 	})
	// 	const AnalyzeImageAction = require('../../../../../frontend/syonet/actions/tensorflowjs/analyze_image')
	// 		.default
	// 	const analyzeImageAction = new AnalyzeImageAction(Stores)
	// 	const result = await analyzeImageAction.readUploadedFileAsText(file)
	// 	expect(result).toBe('data:image/png;base64,AAAAAAAAAAAAAA==')
	// })
})

describe('onClickRemoveImage', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('clicked', async () => {
		Stores.KerasAnalyzeImageStore.Category([
			{
				id: 0,
				name: '',
				images: [
					{
						imageUrl: 'data:image/png;base64,a',
						imageRGB: [],
					},
				],
			},
			{
				id: 1,
				name: '',
				images: [
					{
						imageUrl: 'data:image/png;base64,a',
						imageRGB: [],
					},
				],
			},
		])
		expect(Stores.KerasAnalyzeImageStore.Category()).toEqual([
			{
				id: 0,
				images: [{ imageRGB: [], imageUrl: 'data:image/png;base64,a' }],
				name: '',
			},
			{
				id: 1,
				images: [{ imageRGB: [], imageUrl: 'data:image/png;base64,a' }],
				name: '',
			},
		])

		const AnalyzeImageAction = require('../../../../../frontend/syonet/actions/kerasjs/analyze_image')
			.default
		const analyzeImageAction = new AnalyzeImageAction(Stores)
		await analyzeImageAction.onClickRemoveImage(0, 0)
		expect(Stores.KerasAnalyzeImageStore.Category()).toEqual([
			{ id: 0, images: [], name: '' },
			{
				id: 1,
				images: [{ imageRGB: [], imageUrl: 'data:image/png;base64,a' }],
				name: '',
			},
		])
	})
})
