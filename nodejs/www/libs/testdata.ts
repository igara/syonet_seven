import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../", ".env") });
import { dbConnect, dbClose } from "@www/models/mongoose";
import NotificationModel from "@www/models/mongoose/notification";

import { Notifications } from "@www/libs/testdata/notification";

process.env.DB_HOST = "mongodb://localhost:27017";

export const main = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).TEST = "test";
    await dbConnect();

    await NotificationModel.deleteMany({});
    await Promise.all([NotificationModel.insertMany(Notifications)]);
  } catch (error) {
    console.error(error);
  } finally {
    console.info("import complate testdata ");
    await dbClose();
    process.exit();
  }
};
main();
