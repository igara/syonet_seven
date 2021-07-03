// import * as fs from "fs";
// import * as Canvas from "canvas";

type OGPImageProps = {
  title: string;
  path: string;
  image?: string;
};

export const wrapText = (
  // context: Canvas.CanvasRenderingContext2D,
  context: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
  lineHeight: number,
) => {
  let words = text.split(" "),
    line = "";

  for (let i = 0; i < words.length; i++) {
    let test = words[i];
    let metrics = context.measureText(test);

    while (metrics.width > maxWidth) {
      test = test.substring(0, test.length - 1);
      metrics = context.measureText(test);
    }

    if (words[i] != test) {
      words.splice(i + 1, 0, words[i].substr(test.length));
      words[i] = test;
    }

    test = line + words[i] + " ";
    metrics = context.measureText(test);

    if (metrics.width > maxWidth && i > 0 && y < maxHeight) {
      context.strokeText(line, x, y);
      context.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = test;
    }
  }

  context.strokeText(line, x, y);
  context.fillText(line, x, y);
};

export const createOGPImage = async (ogpProps: OGPImageProps) => {
  // const width = 1200;
  // const height = 630;
  // const fontSize = 100;

  // Canvas.registerFont("public/fonts/NotoSansJP-Regular.otf", { family: "NotoSansJP" });
  // const canvas = new Canvas.Canvas(width, height);
  // const canvasContext = canvas.getContext("2d");

  // const Image = Canvas.Image;
  if (ogpProps.image) {
    // const ogpPropsImage = new Image();
    // ogpPropsImage.src = ogpProps.image;
    // const ratio = width / ogpPropsImage.width;
    // canvasContext.drawImage(ogpPropsImage, 0, 0, width, ogpPropsImage.height * ratio);
  } else {
    // canvasContext.fillStyle = "white";
    // canvasContext.fillRect(0, 0, width, height);
  }
  // const ogpImageFile = fs.readFileSync(`images/ogp.png`);
  // const ogpImage = new Image();
  // ogpImage.src = ogpImageFile;
  // canvasContext.drawImage(ogpImage, 0, 0, width, height);

  // canvasContext.font = `${fontSize}px "NotoSansJP"`;
  // canvasContext.lineWidth = 10;
  // canvasContext.strokeStyle = "white";
  // canvasContext.fillStyle = "black";
  // wrapText(canvasContext, ogpProps.title, 10, 200, width, 500, fontSize);
  // const currentBuffer = Buffer.from(canvas.toDataURL().split(",")[1], "base64");

  // fs.mkdirSync(`public/${ogpProps.path}`, { recursive: true });
  // fs.writeFileSync(`public/${ogpProps.path}/${ogpProps.title}.png`, currentBuffer);
};
