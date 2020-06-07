import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as Chat from "@www/models/mongoose/chat";

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body) {
      res.status(400);
      return res.send({
        status: 400,
        message: "NG",
      });
    }

    const body = JSON.parse(req.body);
    const name = body.name;
    const password = body.password;

    if (!name) {
      res.status(400);
      return res.send({
        status: 400,
        message: "NG",
      });
    }

    await dbConnect();
    const chat = await Chat.createChat(name, password);

    res.status(200);
    return res.send({
      status: 200,
      message: "OK",
      chat,
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

export default create;