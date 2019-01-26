import * as express from 'express'
import * as GoogleSpreadsheet from 'google-spreadsheet'
import { promisify } from 'util'

const router = express.Router()

const credentials = {
	client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL
		? process.env.GOOGLE_SERVICE_CLIENT_EMAIL
		: '',
	private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY
		? process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n')
		: '',
}

const getSpreadSheetPage = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	try {
		if (
			typeof req.query === 'undefined' ||
			req.query === null ||
			typeof req.query.id !== 'string'
		) {
			res.status(500)
			return res.send({
				status: 500,
				message: 'NG',
			})
		}
		const spreadSheet = new GoogleSpreadsheet(req.query.id)
		const useServiceAccountAuth = promisify(spreadSheet.useServiceAccountAuth)
		await useServiceAccountAuth(credentials)
		const getInfo = promisify<{ title: string; worksheets: Array<any> }>(
			spreadSheet.getInfo,
		)
		const sheetInfo = await getInfo()
		const pageTitle = sheetInfo.title
		const sheetsTitles = sheetInfo.worksheets.map(sheet => sheet.title)
		return res.json({
			pageTitle,
			sheetsTitles,
		})
	} catch (error) {
		console.error(error)
		res.status(500)
		return res.send({
			status: 500,
			message: 'NG',
		})
	}
}
router.get('/page', getSpreadSheetPage)

const getSpreadSheet = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	try {
		if (
			typeof req.query === 'undefined' ||
			req.query === null ||
			typeof req.query.id !== 'string' ||
			typeof req.query.sheetTitle !== 'string'
		) {
			res.status(500)
			return res.send({
				status: 500,
				message: 'NG',
			})
		}
		const id = req.query.id
		const sheetTitle = req.query.sheetTitle

		const spreadSheet = new GoogleSpreadsheet(id)
		const useServiceAccountAuth = promisify(spreadSheet.useServiceAccountAuth)
		await useServiceAccountAuth(credentials)

		const getInfo = promisify<{ title: string; worksheets: Array<any> }>(
			spreadSheet.getInfo,
		)
		const sheetInfo = await getInfo()
		const pageTitle = sheetInfo.title

		let rows: Array<{
			'app:edited': string
			id: string
			_xml: string
			save: string
			del: string
			_links: string
		}> = []
		for (const worksheet of sheetInfo.worksheets) {
			if (worksheet.title === sheetTitle) {
				const getRows = promisify<
					Array<{
						'app:edited': string
						id: string
						_xml: string
						save: string
						del: string
						_links: string
					}>
				>(worksheet.getRows)
				const sheetRows = await getRows()
				// const addRow = promisify(worksheet.addRow)
				// await addRow({
				// 	ide: '1',
				// 	name: '2',
				// 	年: '3',
				// })
				rows = sheetRows.map(row => {
					delete row['app:edited']
					delete row.id
					delete row._xml
					delete row.save
					delete row.del
					delete row._links
					return row
				})
			}
		}
		return res.json({
			pageTitle,
			sheetTitle,
			rows,
		})
	} catch (error) {
		console.error(error)
		res.status(500)
		return res.send({
			status: 500,
			message: 'NG',
		})
	}
}
router.get('/sheet', getSpreadSheet)

export default router
