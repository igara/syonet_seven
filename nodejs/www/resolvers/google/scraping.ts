import "reflect-metadata";
import { Resolver, Mutation, ObjectType, Field, Ctx, Arg } from "type-graphql";
import { connect as connectTypeORM } from "@www/models/typeorm/connection";
import { Auth } from "@www/models/typeorm/entities/auth";
import * as googleapis from "@www/libs/googleapis";
// @ts-ignore
import Inliner from "inliner";
import * as fs from "fs";
import { getTimeStamp } from "@www/libs/datetime";

type Context = {
  user?: number;
};

@ObjectType()
class ExecScraping {
  @Field()
  driveID: string;
  html: string;
}

@Resolver()
export class ScrapingResolver {
  @Mutation(() => ExecScraping, { nullable: true })
  async execScraping(@Ctx() ctx: Context, @Arg("url") url: string): Promise<ExecScraping | undefined> {
    if (!ctx.user) {
      return undefined;
    }

    const connect = await connectTypeORM();
    Auth.useConnection(connect);

    const auth = await Auth.findOne({
      id: Number(ctx.user),
    });

    if (!auth) {
      return undefined;
    }

    const googleClient = googleapis.client(auth.accessToken);
    const drive = googleapis.drive(googleClient);

    const appFolderID = (await googleapis.getFolderIDByFolderName(drive, googleapis.folderName.app)) as string;
    const scrapingFolderID = await googleapis.createChildFolderByFolderNameAndFolderID(
      drive,
      googleapis.folderName.scraping,
      appFolderID,
    );

    const inliner = () => {
      return new Promise<string>(
        resolve =>
          new Inliner(url, (_: any, html: string) => {
            resolve(html);
          }),
      );
    };

    const dirPath = "./dist/html";
    const htmlFileName = `${getTimeStamp()}.html`;
    const htmlPath = `${dirPath}/${htmlFileName}`;

    fs.mkdirSync(dirPath, { recursive: true });

    const html = await inliner();
    fs.writeFileSync(htmlPath, html);

    const htmlID = await googleapis.createHTMLFileByHTMLFileNameAndFolderID(
      drive,
      htmlFileName,
      scrapingFolderID,
      html,
    );

    return { driveID: htmlID, html };
  }
}
