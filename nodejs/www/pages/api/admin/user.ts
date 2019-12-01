import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as User from "@www/models/mongoose/user";

const list = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();

    const userCount = await User.getUserCount();
    let limit = isNaN(+req.query.limit) ? 1 : +req.query.limit;
    limit = limit === 0 ? 1 : limit;
    limit = limit < userCount ? limit : userCount;
    let offset = isNaN(+req.query.next) ? 0 : +req.query.next - 1;
    offset = offset < userCount ? offset : userCount;
    const userList = await User.getUserList(offset, limit);
    res.status(200);
    return res.send({
      status: 200,
      message: "OK",
      userCount,
      userList,
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

export default list;
