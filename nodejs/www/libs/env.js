/**
 * アクセス中のHost名から環境変数値を取得する
 * @param {String} hostname
 * @return {String} env 
 */
const getEnvByHostname = (hostname) => {
	let env = 'local'
	if (hostname === 'syonet.work') {
		env = 'prod'
	}
	return env
}

module.exports = {
	getEnvByHostname,
}
