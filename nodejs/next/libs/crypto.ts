import * as crypto from "crypto";

export const encrypt = (text: string) => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET || "";

  const key = crypto.scryptSync(TOKEN_SECRET, TOKEN_SECRET, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text: string) => {
  const textParts = text.split(":");
  if (textParts.length < 2) return "";

  const TOKEN_SECRET = process.env.TOKEN_SECRET || "";

  const key = crypto.scryptSync(TOKEN_SECRET, TOKEN_SECRET, 32);
  const iv = Buffer.from(textParts[0], "hex");
  const encryptedText = Buffer.from(textParts[1], "hex");
  const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
