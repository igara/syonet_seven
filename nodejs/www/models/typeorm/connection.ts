import * as typeorm from "typeorm";

export const connect = async (databaseName: string) => {
  const connection = await typeorm.createConnection(databaseName);
  typeorm.BaseEntity.useConnection(connection);
};
