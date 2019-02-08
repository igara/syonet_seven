import { dbConnect, dbClose } from "@www/models";
import Session from "@www/models/session";
import User from "@www/models/user";
import NotificationModel from "@www/models/notification";

import { Sessions } from "./testdata/session";
import { Users } from "./testdata/user";
import { Notifications } from "./testdata/notification";
(async () => {
	try {
		await dbConnect();

		Session.remove({});
		User.remove({});
		NotificationModel.remove({});
		await Promise.all([
			Session.insertMany(Sessions),
			User.insertMany(Users),
			NotificationModel.insertMany(Notifications)
		]);
	} catch (error) {
		console.error(error);
	} finally {
		console.log("import complate testdata ");
		await dbClose();
		process.exit();
	}
})();
