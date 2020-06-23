import "reflect-metadata";
import { Resolver, Arg, Mutation, Query, ObjectType, Field } from "type-graphql";
import { WebPushUser } from "@www/models/typeorm/entities/webpush_user";
import * as webpush from "web-push";

const contact = process.env.WEBPUSH_CONTACT ? process.env.WEBPUSH_CONTACT : "";
const vapidKeys = {
  publicKey: process.env.WEBPUSH_VAPIDKEYS_PUBLIC ? process.env.WEBPUSH_VAPIDKEYS_PUBLIC : "",
  privateKey: process.env.WEBPUSH_VAPIDKEYS_PRIVATE ? process.env.WEBPUSH_VAPIDKEYS_PRIVATE : "",
};

webpush.setVapidDetails(contact, vapidKeys.publicKey, vapidKeys.privateKey);

@ObjectType()
class GetWebPushKey {
  @Field()
  publicKey: string;
}

@ObjectType()
class CreateWebPushUser {
  @Field()
  message: "Registed" | "OK";
}

@Resolver()
export class WebPushResolver {
  @Query(() => GetWebPushKey, { nullable: true })
  async getWebPushKey(): Promise<GetWebPushKey> {
    return {
      publicKey: vapidKeys.publicKey,
    };
  }

  @Mutation(() => CreateWebPushUser, { nullable: true })
  async createWebPushUser(
    @Arg("endpoint") endpoint: string,
    @Arg("auth") auth: string,
    @Arg("p256dh") p256dh: string,
  ): Promise<CreateWebPushUser> {
    const findWebPushUser = await WebPushUser.findOne({ endpoint, auth, p256dh });
    if (findWebPushUser) {
      return { message: "Registed" };
    }
    const saveWebPushUser = WebPushUser.create({
      endpoint,
      auth,
      p256dh,
    });
    await saveWebPushUser.save();

    const subscription = {
      endpoint,
      keys: {
        auth,
        p256dh,
      },
    };

    const payload = JSON.stringify({
      title: "[syonet]通知ONにしました",
      body: "たまに更新しましたら通知いくように頑張ります",
      icon: "https://avatars3.githubusercontent.com/u/7006562?s=460&v=4",
      url: process.env.WWW_HOST,
    });

    webpush
      .sendNotification(subscription, payload)
      .then()
      .catch(e => console.error(`webpush error ${e}`));

    return { message: "OK" };
  }
}
