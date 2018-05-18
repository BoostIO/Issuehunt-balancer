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
  baseURL: process.env.BASE_URL || 'http://localhost:5050'
}
