import fetch from "isomorphic-fetch";

export type Entry = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

export const callEntries = async (): Promise<Entry[]> => {
  const result = await fetch("https://api.github.com/repos/igara/hatenablog-export/contents/data/igara1119", {
    method: "GET",
  });

  const json = await result.json();
  return json;
};

export const callEntry = async (name: string): Promise<string> => {
  const result = await fetch(
    `https://raw.githubusercontent.com/igara/hatenablog-export/master/data/igara1119/${name}/README.html`,
    {
      method: "GET",
    },
  );

  const text = await result.text();
  return text;
};
