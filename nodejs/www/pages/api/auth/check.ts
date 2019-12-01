import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as User from "@www/models/mongoose/user";
import passport from "passport";

export const check = async (req: NextApiRequest, res: NextApiResponse) => {
  passport.authenticate("jwt", { session: false }, async (err, userId, _) => {
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

export default check;
