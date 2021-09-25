import * as typeorm from "typeorm";
import { TypeormHelper } from "@api/models/typeorm/helper";
import { Auth } from "@api/models/typeorm/entities/auth";
// import { AuthGitHub } from "@api/models/typeorm/entities/auth_github";
// import { AuthGoogle } from "@api/models/typeorm/entities/auth_google";
import { AccessToken } from "@api/models/typeorm/entities/access_token";
import { WebPushMessage } from "@api/models/typeorm/entities/webpush_message";
import { WebPushUser } from "@api/models/typeorm/entities/webpush_user";

let cachedConnection: typeorm.Connection;

export const connection = async () => {
  try {
    TypeormHelper.patchBug(typeorm.Connection);

    const connectionOptions = await typeorm.getConnectionOptions(
      process.env.NODE_ENV
    );

    if (!cachedConnection) {
      cachedConnection = await typeorm.createConnection({
        ...connectionOptions,
        entities: [
          Auth,
          // AuthGitHub,
          // AuthGoogle,
          AccessToken,
          WebPushMessage,
          WebPushUser,
        ],
      });
      typeorm.BaseEntity.useConnection(cachedConnection);
    }
  } catch (e) {
    throw e;
  }
};
