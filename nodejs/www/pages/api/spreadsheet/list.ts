import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as User from "@www/models/mongoose/user";
import passport from "passport";
import * as googleapis from "@www/libs/googleapis";

const spreadsheetFolderName = "家計簿_syonet";

export const list = async (req: NextApiRequest, res: NextApiResponse) => {
  passport.authenticate("jwt", { session: false }, async (err, userId) => {
    try {
      await dbConnect();
      if (err) {
        res.status(401);
        return res.send({
          status: 401,
          message: "NG",
        });
      }
      if (!userId) {
        res.status(401);
        return res.send({
          status: 401,
          message: "NG",
        });
      }

      const user = await User.getUserById(userId);
      if (!user) {
        res.status(401);
        return res.send({
          status: 401,
          message: "NG",
        });
      }

      if (user.auth.provider !== "google") {
        res.status(401);
        return res.send({
          status: 401,
          message: "NG",
        });
      }

      const googleClient = googleapis.client(user.auth.accessToken);
      const drive = googleapis.drive(googleClient);

      let folderId;
      const folderList = await drive.files.list({
        q: `name = '${spreadsheetFolderName}'`
      });
      if (!folderList.data.files || folderList.data.files?.length === 0) {
        const folder = await drive.files.create({
          requestBody: {
            name: spreadsheetFolderName,
            mimeType: "application/vnd.google-apps.folder",
          },
          fields: "id",
        });
        folderId = folder.data.id;
      } else {
        folderId = folderList.data.files[0].id;
      }

      const files = await drive.files.list({ 
        q: `'${folderId}' in parents`
      });
      console.log(files.data.files);

      res.status(200);
      return res.send({
        status: 200,
        message: "OK",
        user: {
          displayName: user.auth.displayName,
          image: user.auth.photos[0].value,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(401);
      return res.send({
        status: 401,
        message: "NG",
      });
    } finally {
      await dbClose();
    }
  })(req, res);
};

export default list;
