import * as express from "express";
import { dbConnect, dbClose } from "@www/models";
import * as User from "@www/models/user";
import * as Session from "@www/models/session";

const router = express.Router();

const list = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const token = req.headers["token"];
		if (typeof token !== "string" || token === null || token === "") {
			res.status(401);
			return res.send({
				status: 401,
				message: "NG"
			});
		}
		const sessionId = token
			.replace(/^connect.sid=s:/, "")
			.replace(/\.\S*$/, "");

		await dbConnect();
		const session = await Session.getSessionBySessionId(sessionId);
		if (
			session === null ||
			typeof session.session.passport === "undefined" ||
			session.session.passport === null ||
			typeof session.session.passport.user === "undefined" ||
			session.session.passport.user === null
		) {
			res.status(401);
			return res.send({
				status: 401,
				message: "NG"
			});
		}
		const id = session.session.passport.user.id;
		const provider = session.session.passport.user.provider;
		const isAdmin: boolean = await User.getIsAdmin(id, provider);
		if (isAdmin === false) {
			res.status(401);
			return res.send({
				status: 401,
				message: "NG"
			});
		}

		const userCount = await User.getUserCount();
		let limit = isNaN(+req.query.limit) ? 1 : +req.query.limit;
		limit = limit === 0 ? 1 : limit;
		limit = limit < userCount ? limit : userCount;
		let offset = isNaN(+req.query.next) ? 0 : +req.query.next - 1;
		offset = offset < userCount ? offset : userCount;
		const userList = await User.getUserList(offset, limit);
		res.status(200);
		return res.send({
			status: 200,
			message: "OK",
			userCount,
			userList
		});
	} catch (error) {
		console.error(error);
		res.status(500);
		return res.send({
			status: 500,
			message: "NG"
		});
	} finally {
		await dbClose();
	}
};

router.get("/", list);

export default router;
