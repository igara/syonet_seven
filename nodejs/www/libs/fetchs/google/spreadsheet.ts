import { call, getApiHost } from "@www/libs/api";

export const callSpreadSheetPage = async (id: string) => {
	const result = await call({
		url: `${getApiHost()}/api/google/spreadsheet/page?id=${id}`,
		method: "GET",
		body: null
	});
	const json = await result.json();
	return json;
};

export const callSpreadSheet = async (id: string, sheetTitle: string) => {
	const result = await call({
		url: `${getApiHost()}/api/google/spreadsheet/sheet?id=${id}&sheetTitle=${sheetTitle}`,
		method: "GET",
		body: null
	});
	const json = await result.json();
	return json;
};
