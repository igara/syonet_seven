import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect, dbClose } from "@www/models";
import * as Session from "@www/models/session";

export const deleteAuth = async (req: NextApiRequest, res: NextApiResponse) => {
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
    if (typeof sessionId === "undefined" || sessionId === null || sessionId === "") {
      res.status(401);
      return res.send({
        status: 401,
        message: "NG",
      });
    }

    await dbConnect();
    const result = await Session.deleteSession(sessionId);
    console.info(result);
    res.status(200);
    return res.send({
      status: 200,
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    return res.send({
      status: 500,
      message: "NG",
    });
  } finally {
    await dbClose();
  }
};

export default deleteAuth;
