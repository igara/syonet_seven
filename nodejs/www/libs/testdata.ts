import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../", ".env") });
import { dbConnect, dbClose } from "@www/models/mongoose";
import User from "@www/models/mongoose/user";
import NotificationModel from "@www/models/mongoose/notification";

import { Users } from "@www/libs/testdata/user";
import { Notifications } from "@www/libs/testdata/notification";

process.env.DB_HOST = "mongodb://localhost:27017";

export const main = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).TEST = "test";
    await dbConnect();

    await User.deleteMany({});
    await NotificationModel.deleteMany({});
    await Promise.all([User.insertMany(Users), NotificationModel.insertMany(Notifications)]);
  } catch (error) {
    console.error(error);
  } finally {
    console.info("import complate testdata ");
    await dbClose();
    process.exit();
  }
};
main();
