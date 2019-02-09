import { dbConnect, dbClose } from "@www/server/models";
import Session from "@www/server/models/session";
import User from "@www/server/models/user";
import NotificationModel from "@www/server/models/notification";

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
