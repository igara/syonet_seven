// @flow

import * as tf from '@tensorflow/tfjs'
import { mod } from '@tensorflow/tfjs'

export const save = async (Stores: Stores) => {
	const category = Stores.AnalyzeImageSaveStore.Category()

	const imagesRGBs = []
	category.forEach(c => {
		c.images.forEach(image => {
			imagesRGBs.push(image.imageRGB)
		})
	})
	console.log(JSON.stringify(imagesRGBs))

	// Define a model for linear regression.
	const model = tf.sequential()

	model.add(
		tf.layers.conv2d({
			inputShape: [3, 128, 128],
			kernelSize: [3, 3],
			filters: 32,
			padding: 'same',
		}),
	)
	model.add(tf.layers.activation('relu'))
	model.add(
		tf.layers.conv2d({
			kernelSize: [3, 3],
			filters: 32,
		}),
	)
	model.add(tf.layers.activation('relu'))
	model.add(
		tf.layers.maxPooling2d({
			poolSize: [2, 2],
		}),
	)
	model.add(tf.layers.dropout({ rate: 0.25 }))

	model.add(
		tf.layers.conv2d({
			kernelSize: [3, 3],
			filters: 64,
			padding: 'same',
		}),
	)
	model.add(tf.layers.activation('relu'))
	model.add(
		tf.layers.conv2d({
			kernelSize: [3, 3],
			filters: 64,
		}),
	)
	model.add(tf.layers.activation('relu'))
	model.add(
		tf.layers.maxPooling2d({
			poolSize: [2, 2],
		}),
	)
	model.add(
		tf.layers.dropout({
			rate: 0.25,
		}),
	)

	model.add(tf.layers.flatten())
	model.add(
		tf.layers.dense({
			units: 10,
			inputDim: 512,
		}),
	)
	model.add(tf.layers.activation('relu'))
	model.add(
		tf.layers.dropout({
			rate: 0.5,
		}),
	)
	model.add(
		tf.layers.dense({
			units: 10,
			inputDim: imagesRGBs.length,
		}),
	)
	model.add(tf.layers.activation('softmax'))
	const optimizer = tf.train.adam({
		learningRate: 0.001,
	})

	model.compile({
		optimizer: optimizer,
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy'],
	})

	const x = tf.tensor(imagesRGBs)
	console.log(imagesRGBs.length)
	const y = tf.tensor([[1, 0, 0, 0], [0, 0, 0, 1]])
	console.log(x)
	console.log(y)
	console.log(model)
	await model.fit(x, y)

	// // Run inference with predict().
	// model.predict(tf.tensor2d([[1, 1, 1, 1]], [1, 4])).print()
	// await model.save('localstorage://test')
}

export const load = async () => {
	const model = await tf.loadModel('localstorage://test')
	model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' })
	model.predict(tf.tensor2d([[5]], [1, 1])).print()
}
