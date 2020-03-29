import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect, dbClose } from "@www/models/mongoose";

export const deleteAuth = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();

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
