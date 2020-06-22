module.exports = {
  type: "mysql",
  host: "mysql",
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: false,
  entities: ["models/typeorm/entities/**/*.ts"],
  migrations: ["models/typeorm/migrations/**/*.ts"],
  subscribers: ["models/typeorm/subscribers/**/*.ts"],
  cli: {
    entitiesDir: "models/typeorm/entities",
    migrationsDir: "models/typeorm/migrations",
    subscribers: "models/typeorm/subscribers",
  },
};
