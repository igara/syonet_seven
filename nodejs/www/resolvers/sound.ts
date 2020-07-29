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
  message: string;
}

@Resolver()
export class SoundResolver {
  @Query(() => SearchSound, { nullable: true })
  async searchSound(@Arg("peaks") peaks: string): Promise<SearchSound> {
    const result = await search(peaks);

    return { message: JSON.stringify(result.body) };
  }

  @Mutation(() => CreateSound, { nullable: true })
  async createSound(@Arg("name") name: string, @Arg("peaks") peaks: string): Promise<CreateSound> {
    await create(name, peaks);
    return { message: "OK" };
  }
}
