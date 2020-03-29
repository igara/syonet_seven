import mongoose from "mongoose";

export const dbConnect = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((global as any).TEST && (global as any).TEST === "test") {
    return await mongoose.connect(`${process.env.DB_HOST}/test`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }

  return await mongoose.connect(`${process.env.DB_HOST}/syonet`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

export const dbClose = async () => {
  return await mongoose.connection.close();
};
