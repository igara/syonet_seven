declare class GoogleSpreadsheet {
	constructor(id: any);
	useServiceAccountAuth(credentials: {
		client_email: string;
		private_key: string;
	}): void;
	getInfo(): { title: string; worksheets: Array<any> };
}

declare module GoogleSpreadsheet {}

declare module "google-spreadsheet" {
	export = GoogleSpreadsheet;
}
