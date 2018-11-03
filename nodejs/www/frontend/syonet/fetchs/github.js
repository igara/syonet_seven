// @flow

/**
 * 解析データ一覧の取得
 * @return {{}} json
 */
export const callAnalyzeImageList = async () => {
	const result = await fetch(
		'https://api.github.com/repos/igara/syonet_seven_storage/contents/analyze_image',
		{
			method: 'GET',
		},
	)
	const json = await result.json()
	if (json instanceof Array) {
		return json.filter(j => j.name !== 'README.md')
	}
	return json
}

/**
 * 解析データの取得
 * @return {{}} json
 */
export const callAnalyzeImageModel = async (modelDir: string) => {
	const result = await fetch(
		`https://raw.githubusercontent.com/igara/syonet_seven_storage/master/analyze_image/${modelDir}/model.json`,
		{
			method: 'GET',
		},
	)
	const json = await result.json()
	return json
}
