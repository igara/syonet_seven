// @flow

/**
 * ミリ秒遅延させる
 * @param {Number} msec
 * @return {Promise}
 */
const sleep = (msec: number) => {
	return new Promise(resolve => setTimeout(resolve, msec))
}

module.exports = sleep
