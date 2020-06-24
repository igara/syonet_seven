import * as typeorm from "typeorm";

export const connect = async (databaseName: string) => {
  if (process.env.MYSQL_DATABASE) {
    const connection = await typeorm.createConnection(databaseName);
    typeorm.BaseEntity.useConnection(connection);
  }
};
