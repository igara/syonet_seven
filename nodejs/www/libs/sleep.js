// @flow

/**
 * ミリ秒遅延させる
 * @param {Number} msec
 * @return {Promise}
 */
export const sleep = (msec: number) => {
	return new Promise(resolve => setTimeout(resolve, msec))
}
