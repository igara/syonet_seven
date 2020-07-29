import { client } from "@www/models/elasticsearch/client";
const index = "sounds";
const type = "sound";

export const create = async (name: string, peaks: string) => {
  await client.index({
    index,
    body: {
      name,
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
