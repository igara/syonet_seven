import * as GoogleAuthLibrary from "google-auth-library";
import * as googleapis from "googleapis";

export const folderName = {
  app: "syonet_webapp",
  scraping: "scraping",
};

export const client = (token: string) => {
  const oauth2Client = new googleapis.google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "",
    process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET : "",
    process.env.GOOGLE_CALLBACK ? process.env.GOOGLE_CALLBACK : "",
  );

  oauth2Client.setCredentials({ access_token: token });
  return oauth2Client;
};

export const drive = (oauth2Client: GoogleAuthLibrary.OAuth2Client) => {
  return googleapis.google.drive({
    version: "v3",
    auth: oauth2Client,
  });
};

export const sheets = (oauth2Client: GoogleAuthLibrary.OAuth2Client) => {
  return googleapis.google.sheets({
    version: "v4",
    auth: oauth2Client,
  });
};

export const getFolderIDByFolderName = async (googleDrive: googleapis.drive_v3.Drive, folderName: string) => {
  const folderList = await googleDrive.files.list({
    q: `name = '${folderName}'`,
  });
  if (!folderList.data.files || folderList.data.files.length === 0) {
    const folder = await googleDrive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });
    return folder.data.id;
  }
  return folderList.data.files[0].id;
};

export const createChildFolder = async (googleDrive: googleapis.drive_v3.Drive, folderName: string, folderID: string) =>
  await googleDrive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [folderID],
    },
    fields: "id",
  });

export const createChildFolderByFolderNameAndFolderID = async (
  googleDrive: googleapis.drive_v3.Drive,
  folderName: string,
  folderID: string,
) => {
  const folderList = await googleDrive.files.list({
    q: `'${folderID}' in parents`,
  });

  if (!folderList.data.files || folderList.data.files.length === 0) {
    const folder = await createChildFolder(googleDrive, folderName, folderID);
    return folder.data.id as string;
  }

  const folder = folderList.data.files.find(file => file.name === folderName);
  if (!folder) {
    const createFolder = await createChildFolder(googleDrive, folderName, folderID);
    return createFolder.data.id as string;
  }

  return folder.id as string;
};

export const createHTMLFileByHTMLFileNameAndFolderID = async (
  googleDrive: googleapis.drive_v3.Drive,
  htmlFileName: string,
  folderID: string,
  html: string,
) => {
  const htmlFile = await googleDrive.files.create({
    requestBody: {
      name: htmlFileName,
      mimeType: "text/html",
      parents: [folderID],
    },
    media: {
      mimeType: "text/html",
      body: html,
    },
    fields: "id",
  });
  return htmlFile.data.id as string;
};
