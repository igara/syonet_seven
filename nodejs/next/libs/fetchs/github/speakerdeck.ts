import fetch from "isomorphic-fetch";

export type Deck = {
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

export const callDecks = async (): Promise<Deck[]> => {
  const result = await fetch("https://api.github.com/repos/igara/speakerdeck-export/contents/data/igara", {
    method: "GET",
  });

  const json = await result.json();
  return json;
};

export const callDeck = async (deskTitle: string): Promise<Deck[]> => {
  const result = await fetch(`https://api.github.com/repos/igara/speakerdeck-export/contents/data/igara/${deskTitle}`, {
    method: "GET",
  });

  const json = await result.json();
  return json;
};
