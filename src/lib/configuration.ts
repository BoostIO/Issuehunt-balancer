import dotenv from 'dotenv'

switch (process.env.NODE_ENV) {
  case 'production':
    dotenv.config({
      path: 'production.env'
    })
    break
  case 'test':
    dotenv.config({
      path: 'test.env'
    })
    break
  default:
    dotenv.config()
}

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5050,
  baseURL: process.env.BASE_URL || 'http://localhost:5050',

  DBtype: process.env.DATABASE_TYPE as any || 'postgres',
  database: process.env.DATABASE_NAME || 'balance',
  DBusername: process.env.DATABASE_USERNAME || 'guieenoutis',
  DBpassword: process.env.DATABASE_PASSWORD || '',
  DBhost: process.env.DATABASE_HOST || 'localhost',
  DBport: process.env.DATABASE_PORT || 5432
}
