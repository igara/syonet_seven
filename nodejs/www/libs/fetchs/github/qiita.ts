import fetch from "isomorphic-fetch";

export type Item = {
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

export const callItems = async (): Promise<Item[]> => {
  const result = await fetch("https://api.github.com/repos/igara/qiita-export/contents/data/igara", {
    method: "GET",
  });

  const json = await result.json();
  return json;
};
