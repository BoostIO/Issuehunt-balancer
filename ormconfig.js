const dotenv = require('dotenv')

let parsedConfig = {
  ...process.env
}
switch (process.env.NODE_ENV) {
  case 'production':
    parsedConfig = {
      ...parsedConfig,
      ...dotenv
        .config({
          path: 'production.env'
        }).parsed
    }
    break
  case 'test':
    parsedConfig = {
      ...parsedConfig,
      ...dotenv
        .config({
          path: 'test.env'
        }).parsed
    }
    break
  default:
    parsedConfig = {
      ...parsedConfig,
      ...dotenv.config().parsed
    }
}

module.exports = {
  name: 'default',
  type: parsedConfig.DB_TYPE,
  host: parsedConfig.DB_HOST,
  port: parsedConfig.DB_PORT,
  username: parsedConfig.DB_USERNAME,
  password: parsedConfig.DB_PASSWORD,
  database: parsedConfig.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [
    'src/entities/**/*.ts'
  ],
  migrations: [
    'src/migrations/**/*.ts'
  ],
  migrationsTableName: 'migration_logs',
  subscribers: [
    'src/subscribers/**/*.ts'
  ],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers'
  }
}
