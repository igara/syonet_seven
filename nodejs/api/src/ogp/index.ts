import express from "express";
import * as Jimp from "jimp";
import * as fs from "fs";

const router = express.Router();

export const ogp = async (req: express.Request, res: express.Response) => {
  const width = 1200;
  const height = 630;
  const fontSize = 100;

  console.log(11111);

  // const font = await Jimp.loadFont("./src/ogp/NotoSansJP-Regular.otf");
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

  console.log(222222);
  // const newImage = new Jimp.default(width, height, "white", (err) => {
  //   if (err) throw err;
  // });

  console.log(3333);

  // newImage.print(font, 0, 0, "ddddd", 32);
  const ogpImageFile = await Jimp.read("./src/ogp/ogp.png");
  console.log(444444);
  // newImage.composite(ogpImageFile, 0, 0);

  const mineType = ogpImageFile.getMIME();
  const buffer = await ogpImageFile.getBufferAsync(mineType);
  // res.contentType(mineType);
  res.type("png");
  // res.status(200);
  return res.send(buffer);
};

router.get("/ogp.png", ogp);

export default router;
