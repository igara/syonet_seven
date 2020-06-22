import "reflect-metadata";
import { Resolver, Query, Ctx } from "type-graphql";
import { Auth } from "@www/models/typeorm/entities/auth";

type Context = {
  user: number;
};

@Resolver(Auth)
export class AuthResolver {
  @Query(() => Auth, { nullable: true, description: "set header Authorization: `Bearer ${token}`" })
  async checkAuth(@Ctx() ctx: Context): Promise<Auth | undefined> {
    if (!ctx.user) {
      return undefined;
    }
    const auth = await Auth.findOne({
      id: Number(ctx.user),
    });
    if (!auth) {
      return undefined;
    }

    return auth;
  }
}
