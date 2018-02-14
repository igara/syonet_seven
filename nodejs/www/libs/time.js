/**
 * ミリ秒遅延させる
 * @param {Number} msec 
 */
const sleep = (msec) => {
	return new Promise(resolve => setTimeout(resolve, msec))
}

module.exports = {
	sleep,
}
