import fetch from "isomorphic-fetch";

export const callJinsei = async (): Promise<string> => {
  const result = await fetch("https://raw.githubusercontent.com/igara/jinsei/master/README.html", {
    method: "GET",
  });

  const text = await result.text();
  return text;
};
