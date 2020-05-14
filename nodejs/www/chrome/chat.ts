import puppeteer from "puppeteer";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

export const exec = async (chatID: string, password: string, time: number) => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    args: ["--no-sandbox", "--disable-gpu", "--disable-setuid-sandbox"],
  });

  const userAgent = "WebRTC MCU Chat";
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setDefaultNavigationTimeout(0);
  await page.setUserAgent(userAgent);

  const chatURL = `${process.env.WWW_HOST}/tools/chat`;
  await page.goto(chatURL);
  await page.waitFor(1000);
  await page.waitFor("input[placeholder='部屋のパスワード']");
  await page.waitFor("input[placeholder='部屋ID']");
  await page.waitFor(`//button[text()="参加"]`);
  await page.type("input[placeholder='部屋ID']", chatID);
  await page.type("input[placeholder='部屋のパスワード']", password);
  await (await page.$x(`//button[text()="参加"]`))[0].click();
  await page.waitFor(1000);

  let loopFlag = true;
  while (loopFlag) {
    const nowDate = new Date();
    if (time < nowDate.getTime()) {
      loopFlag = false;
      await page.close();
      await browser.close();
    }
  }
};

const chatIDKeyValue = process.argv.join().match(/chatID=\S*/);
const passwordKeyValue = process.argv.join().match(/password=\S*/);
const timeKeyValue = process.argv.join().match(/time=\S*/);
if (
  chatIDKeyValue &&
  chatIDKeyValue.length === 1 &&
  passwordKeyValue &&
  passwordKeyValue.length === 1 &&
  timeKeyValue &&
  timeKeyValue.length === 1
) {
  const chatID = chatIDKeyValue[0].replace("chatID=", "").replace(/,\S*/, "");
  const password = passwordKeyValue[0].replace("password=", "").replace(/,\S*/, "");
  const time = Number(timeKeyValue[0].replace("time=", ""));

  exec(chatID, password, time);
}
