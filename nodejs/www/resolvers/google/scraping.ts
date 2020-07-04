import "reflect-metadata";
import { Resolver, Mutation, Query, ObjectType, Field, Ctx, Arg } from "type-graphql";
import { connect as connectTypeORM } from "@www/models/typeorm/connection";
import { Auth } from "@www/models/typeorm/entities/auth";
import * as googleapis from "@www/libs/googleapis";
// @ts-ignore
import Inliner from "inliner";
import { getTimeStamp } from "@www/libs/datetime";

type Context = {
  user?: number;
};

@ObjectType()
class ExecScraping {
  @Field()
  html: string;
}

@ObjectType()
class SaveScrapingHTML {
  @Field()
  driveID: string;
  @Field()
  html: string;
  @Field()
  url: string;
  @Field()
  title: string;
}

@Resolver()
export class ScrapingResolver {
  @Query(() => ExecScraping, { nullable: true })
  async execScraping(@Arg("url") url: string): Promise<ExecScraping> {
    const inliner = () => {
      return new Promise<string>(
        resolve =>
          new Inliner(url, (_: any, html: string) => {
            resolve(html);
          }),
      );
    };

    const html = await inliner();

    return { html };
  }

  @Mutation(() => SaveScrapingHTML, { nullable: true })
  async saveScrapingHTML(
    @Ctx() ctx: Context,
    @Arg("html") html: string,
    @Arg("url") url: string,
    @Arg("title") title: string,
  ): Promise<SaveScrapingHTML | undefined> {
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
    await googleapis.createPermission(drive, scrapingFolderID);
    const scrapingURLFolderID = await googleapis.createChildFolderByFolderNameAndFolderID(drive, url, scrapingFolderID);
    const scrapingTitleFolderID = await googleapis.createChildFolderByFolderNameAndFolderID(
      drive,
      title,
      scrapingURLFolderID,
    );

    const htmlFileName = `${getTimeStamp()}.html`;
    const htmlID = await googleapis.createHTMLFileByHTMLFileNameAndFolderID(
      drive,
      htmlFileName,
      scrapingTitleFolderID,
      html,
    );

    return { driveID: htmlID, html, url, title };
  }
}
