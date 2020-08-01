import "reflect-metadata";
import { Arg, Resolver, Mutation, ObjectType, Field, Query } from "type-graphql";
import { create, search } from "@www/models/elasticsearch/sound";

@ObjectType()
class CreateSound {
  @Field()
  message: string;
}

@ObjectType()
class SearchSound {
  @Field()
  name: string;
  @Field()
  artist: string;
}

@Resolver()
export class SoundResolver {
  @Query(() => SearchSound, { nullable: true })
  async searchSound(@Arg("peaks") peaks: string): Promise<SearchSound> {
    const result = await search(peaks);
    if (result.body && result.body.hits && result.body.hits.hits && result.body.hits.hits.length > 0) {
      const source = result.body.hits.hits[0]["_source"];
      return {
        name: source.name,
        artist: source.artist,
      };
    }

    return {
      name: "",
      artist: "",
    };
  }

  @Mutation(() => CreateSound, { nullable: true })
  async createSound(
    @Arg("name") name: string,
    @Arg("artist") artist: string,
    @Arg("peaks") peaks: string,
  ): Promise<CreateSound> {
    await create(name, artist, peaks);
    return { message: "OK" };
  }
}
