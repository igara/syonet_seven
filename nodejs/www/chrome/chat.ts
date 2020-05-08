import puppeteer from "puppeteer";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

export const exec = async (chatID: string, password: string) => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const userAgent = "WebRTC MCU Chat";

  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setDefaultNavigationTimeout(0);
  await page.setUserAgent(userAgent);

  const chatURL = `${process.env.WWW_HOST}/tools/chat`;
  await page.goto(chatURL);

  await page.waitFor(1000);
  await page.type("input[placeholder='部屋ID']", chatID);
  await page.type("input[placeholder='部屋のパスワード']", password);
  await page.waitFor(1000);
  await (await page.$x(`//button[text()="参加"]`))[0].click();
  await page.waitFor(1000);
};

// exec("5eaf84109c4774012333a6ba", "");
