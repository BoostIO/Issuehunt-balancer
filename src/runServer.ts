import 'reflect-metadata'
import app from './app'
import configuration from './configuration'
import { createTypeormConnection } from './lib/database/createTypeormConnection'

const runServer = async () => {
  await createTypeormConnection()
  app.listen(configuration.port, () => console.log(`Express application is up and running on port ${configuration.port}`))
}

runServer()
  .catch(e => console.log(e))
