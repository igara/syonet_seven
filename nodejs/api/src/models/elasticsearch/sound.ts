import { client } from "@api/models/elasticsearch/client";
const index = "sounds";
const type = "sound";

export const create = async (name: string, artist: string, peaks: string) => {
  await client.index({
    index,
    body: {
      name,
      artist,
      peaks,
    },
    type,
  });
};

export const search = async (peaks: string) => {
  return await client.search({
    index,
    body: {
      query: {
        match: { peaks },
      },
    },
    type,
  });
};
