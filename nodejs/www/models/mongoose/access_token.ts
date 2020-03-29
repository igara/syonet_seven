import mongoose, { Document, Schema } from "mongoose";
import { UserData } from "@www/models/mongoose/user";

export type AccessTokenData = {
  user: UserData;
  token: string;
};

export interface AccessTokenDocument extends Document {
  user: UserData;
  token: string;
}

const AccerssTokenSchema: Schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    token: String,
  },
  { collection: "access_tokens" },
);

export const getJoinUserByToken = async (token: string): Promise<AccessTokenDocument | null> => {
  const result = await AccessToken.findOne({
    token: token,
  }).populate("user");
  return result;
};

AccerssTokenSchema.methods.getJoinUserByToken = getJoinUserByToken;

export const upsertAccessTokenByTokenAndUserId = async (
  token: string,
  userId: string,
): Promise<AccessTokenDocument> => {
  const findResult = await AccessToken.findOneAndUpdate(
    { token: token, user: userId },
    { $set: { user: userId } },
    { upsert: true, setDefaultsOnInsert: true, new: true },
  );
  return findResult;
};

AccerssTokenSchema.methods.upsertAccessTokenByTokenAndUserId = upsertAccessTokenByTokenAndUserId;

const AccessToken =
  mongoose.models.AccessToken || mongoose.model<AccessTokenDocument>("AccessToken", AccerssTokenSchema);
export default AccessToken;
