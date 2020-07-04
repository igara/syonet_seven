describe("ScrapingResolver: execScraping", () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-ignore
    process.env.NODE_ENV = "test";
  });

  test("execScraping", async () => {
    const { ScrapingResolver } = await import("@www/resolvers/google/scraping");
    const scrapingResolver = new ScrapingResolver();

    const execScraping = await scrapingResolver.execScraping("https://syonet.work");

    expect(execScraping.html).not.toBeUndefined();
  }, 10000);
});

describe("ScrapingResolver: saveScrapingHTML", () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-ignore
    process.env.NODE_ENV = "test";
  });

  test("not user", async () => {
    const html = "<html></html>";
    const title = "title";
    const url = "https://syonet.work";

    const { ScrapingResolver } = await import("@www/resolvers/google/scraping");
    const scrapingResolver = new ScrapingResolver();

    const ctx = {};
    const saveScrapingHTML = await scrapingResolver.saveScrapingHTML(ctx, html, url, title);

    expect(saveScrapingHTML).toBeUndefined();
  });

  test("not auth user", async () => {
    const html = "<html></html>";
    const title = "title";
    const url = "https://syonet.work";

    const { ScrapingResolver } = await import("@www/resolvers/google/scraping");
    const scrapingResolver = new ScrapingResolver();

    const ctx = { user: 1111 };
    const saveScrapingHTML = await scrapingResolver.saveScrapingHTML(ctx, html, url, title);

    expect(saveScrapingHTML).toBeUndefined();
  });

  test("save", async () => {
    const html = "<html></html>";
    const driveID = "abcdefg";
    const title = "title";
    const url = "https://syonet.work";

    jest.doMock(
      "@www/libs/googleapis",
      jest.fn().mockImplementationOnce(() => ({
        folderName: {
          app: "hoge",
        },
        client: jest.fn().mockImplementation(() => jest.fn()),
        drive: jest.fn().mockImplementation(() => jest.fn()),
        getFolderIDByFolderName: jest.fn().mockImplementation(() => jest.fn()),
        createChildFolderByFolderNameAndFolderID: jest.fn().mockImplementation(() => jest.fn()),
        createPermission: jest.fn().mockImplementation(() => jest.fn()),
        createHTMLFileByHTMLFileNameAndFolderID: jest.fn().mockImplementation(() => driveID),
      })),
    );

    const { connect } = await import("@www/models/typeorm/connection");
    const { AuthFacebook } = await import("@www/models/typeorm/entities/auth_facebook");
    const connection = await connect();
    AuthFacebook.useConnection(connection);

    const user = {
      snsID: "1111",
      username: "username",
      imageURL: "https://example.com",
      accessToken: "accessToken",
    };
    const authFacebook = AuthFacebook.create({
      snsID: user.snsID,
      username: user.username,
      imageURL: user.imageURL,
      accessToken: user.accessToken,
    });
    const saveAuthData = await authFacebook.save();

    const { ScrapingResolver } = await import("@www/resolvers/google/scraping");
    const scrapingResolver = new ScrapingResolver();

    const ctx = {
      user: saveAuthData.id,
    };
    const saveScrapingHTML = await scrapingResolver.saveScrapingHTML(ctx, html, url, title);

    expect(saveScrapingHTML).not.toBeUndefined();
    if (!saveScrapingHTML) return;
    expect(saveScrapingHTML.driveID).toBe(driveID);
  });
});
