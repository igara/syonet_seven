import * as typeorm from "typeorm";

export const connect = async () => {
  if (process.env.MYSQL_DATABASE) {
    const connection = await typeorm.createConnection();
    typeorm.BaseEntity.useConnection(connection);
  }
};
