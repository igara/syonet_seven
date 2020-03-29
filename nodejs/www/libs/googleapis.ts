import * as GoogleAuthLibrary from "google-auth-library";
import * as googleapis from "googleapis";

export const client = (token: string) => {
  try {
    const oauth2Client = new googleapis.google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "",
      process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET : "",
      process.env.GOOGLE_CALLBACK ? process.env.GOOGLE_CALLBACK : "",
    );

    oauth2Client.setCredentials({ access_token: token });
    return oauth2Client;
  } catch (error) {
    throw new Error(error);
  }
};

export const drive = (oauth2Client: GoogleAuthLibrary.OAuth2Client) =>
  googleapis.google.drive({
    version: "v3",
    auth: oauth2Client,
  });

export const sheets = (oauth2Client: GoogleAuthLibrary.OAuth2Client) =>
  googleapis.google.sheets({
    version: "v4",
    auth: oauth2Client,
  });
