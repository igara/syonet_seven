/**
 * タイムスタンプ値を取得
 * @return {Number}
 */
const getDateTime = () => {
	return Math.round((new Date()).getTime() / 1000)
}

module.exports = {
	getDateTime,
}
