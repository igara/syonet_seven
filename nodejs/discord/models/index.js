// @flow

import mongoose from "mongoose";

export const dbConnect = async () => {
  if (global.TEST === "test" || process.env.TEST === "test") {
    await mongoose.connect(
      `${process.env.DB_HOST}/test`,
      { useNewUrlParser: true }
    );
  } else {
    await mongoose.connect(
      `${process.env.DB_HOST}/syonet`,
      { useNewUrlParser: true }
    );
  }
};

export const dbClose = async () => {
  await mongoose.connection.close();
};

export default mongoose;
