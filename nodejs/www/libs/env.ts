/**
 * アクセス中のHost名から環境変数値を取得する
 */
export const getEnvByHostname = (hostname: string) => {
	let env = "local";
	if (hostname === "syonet.work") {
		env = "prod";
	}
	return env;
};
