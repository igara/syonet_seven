import * as express from "express";
import { dbConnect, dbClose } from "@www/server/models";
import User from "@www/server/models/user";

const router = express.Router();

/* GET users listing. */
router.get("/", async (req: express.Request, res: express.Response, next) => {
	await dbConnect();
	const userList = await User.find({});
	console.log(userList);
	await dbClose();
	return res.send("respond with a resource");
});

export default router;
