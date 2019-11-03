import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect, dbClose } from "@www/models";
import * as User from "@www/models/user";
import * as Session from "@www/models/session";

export const check = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers["token"];
    if (typeof token !== "string" || token === null || token === "") {
      res.status(401);
      return res.send({
        status: 401,
        message: "NG",
      });
    }
    const sessionId = token.replace(/^connect.sid=s:/, "").replace(/\.\S*$/, "");
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
        message: "NG",
      });
    }
    const id = session.session.passport.user.id;
    const provider = session.session.passport.user.provider;
    const userInfo = await User.getUserInfo(id, provider);
    if (typeof userInfo === "undefined" || userInfo === null) {
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
      user: userInfo,
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
};

export default check;
