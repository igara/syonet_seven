import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  const secret = process.env.TOKEN_SECRET || "xxxxxxx";
  const token = jwt.sign({}, secret, {
    expiresIn: "1 hour",
    audience: process.env.TOKEN_AUDIENCE,
    issuer: process.env.TOKEN_ISSUER,
    subject: userId,
  });

  return token;
};
