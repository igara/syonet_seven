module.exports = [
  {
    name: "development",
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: false,
    logging: false,
    cli: {
      entitiesDir: "src/models/typeorm/entities",
      migrationsDir: "src/models/typeorm/migrations",
      subscribers: "src/models/typeorm/subscribers",
    },
  },
  {
    name: "production",
    type: "aurora-data-api",
    region: "us-east-1",
    resourceArn: process.env.AWS_AURORA_SERVERLESS_ARN,
    secretArn: process.env.AWS_SECRETSMANAGER_ARN,
    database: process.env.AWS_AURORA_SERVERLESS_DATABASE,
    cli: {
      entitiesDir: "src/models/typeorm/entities",
      migrationsDir: "src/models/typeorm/migrations",
      subscribers: "src/models/typeorm/subscribers",
    },
  },
  {
    name: "test",
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: "testdb",
    synchronize: true,
    dropSchema: true,
    logging: false,
    cli: {
      entitiesDir: "src/models/typeorm/entities",
      migrationsDir: "src/models/typeorm/migrations",
      subscribers: "src/models/typeorm/subscribers",
    },
  },
];