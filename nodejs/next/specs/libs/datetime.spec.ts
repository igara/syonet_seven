import { getMultiFormatDateTime, getTimeStamp } from "@www/libs/datetime";
import { advanceTo } from "jest-date-mock";

describe("getTimeStamp", () => {
  beforeEach(() => {
    jest.resetModules();
    advanceTo(new Date("2018/11/11 11:11:11"));
  });
  test("Date 2018/11/11 11:11:11", async () => {
    const date = new Date("2018/11/11 11:11:11");
    expect(getTimeStamp()).toBe(Math.round(date.getTime() / 1000));
  });
});

describe("getMultiFormatDateTime", () => {
  beforeEach(() => {
    jest.resetModules();
    advanceTo(new Date("2018/11/11 11:11:11"));
  });

  test("Date 2018/11/11 11:11:11 format", async () => {
    let option = {
      format: "yyyy/MM/dd HH:mm:ss",
    };
    expect(getMultiFormatDateTime(option)).toBe("2018/11/11 11:11:11");
    option = {
      format: "yyyy年MM月dd日 HH時mm分ss秒",
    };
    expect(getMultiFormatDateTime(option)).toBe("2018年11月11日 11時11分11秒");
  });

  test("Date 2018-11-11 11:11:11 seconds", async () => {
    let option = {
      seconds: -1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 11:11:10");
    option = {
      seconds: 1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 11:11:12");
    option = {
      seconds: -60,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 11:10:11");
    option = {
      seconds: 60,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 11:12:11");
  });

  test("Date 2018-11-11 11:11:11 minutes", async () => {
    let option = {
      minutes: -1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 11:10:11");
    option = {
      minutes: 1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 11:12:11");
    option = {
      minutes: -60,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 10:11:11");
    option = {
      minutes: 60,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 12:11:11");
  });

  test("Date 2018-11-11 11:11:11 hours", async () => {
    let option = {
      hours: -1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 10:11:11");
    option = {
      hours: 1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-11 12:11:11");
    option = {
      hours: -24,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-10 11:11:11");
    option = {
      hours: 24,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-12 11:11:11");
  });

  test("Date 2018-11-11 11:11:11 date", async () => {
    let option = {
      day: -1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-10 11:11:11");
    option = {
      day: 1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-11-12 11:11:11");
    option = {
      day: -30,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-10-12 11:11:11");
    option = {
      day: 30,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-12-11 11:11:11");
  });

  test("Date 2018-11-11 11:11:11 month", async () => {
    let option = {
      month: -1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-10-11 11:11:11");
    option = {
      month: 1,
    };
    expect(getMultiFormatDateTime(option)).toBe("2018-12-11 11:11:11");
    option = {
      month: -12,
    };
    expect(getMultiFormatDateTime(option)).toBe("2017-11-11 11:11:11");
    option = {
      month: 12,
    };
    expect(getMultiFormatDateTime(option)).toBe("2019-11-11 11:11:11");
  });
});
