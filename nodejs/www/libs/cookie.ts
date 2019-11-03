import UniversalCookies from "universal-cookie";
import { IncomingMessage } from "http";

export const Cookies = (req?: IncomingMessage) => {
  if (req && req.headers && !process.browser) {
    return new UniversalCookies(req.headers.cookie);
  }
  return new UniversalCookies();
};
