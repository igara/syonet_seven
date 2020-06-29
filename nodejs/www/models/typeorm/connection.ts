import * as typeorm from "typeorm";

export const connect = async () => {
  try {
    const databaseName = process.env.NODE_ENV === "test" ? "test" : "default";
    const connectionOptions = await typeorm.getConnectionOptions(databaseName);
    const connection = await typeorm.createConnection({
      ...connectionOptions,
      name: "syonet",
    });
    typeorm.BaseEntity.useConnection(connection);
    return connection;
  } catch (e) {
    const connection = await typeorm.getConnection("syonet");
    typeorm.BaseEntity.useConnection(connection);
    return connection;
  }
};
