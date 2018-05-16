import 'reflect-metadata'
import app from './app'
import configuration from './lib/configuration'
import { createTypeormConn } from './database/createTypeormConn'

const runServer = async () => {
  await createTypeormConn()
  app.listen(configuration.port, () => console.log(`Express application is up and running on port ${configuration.port}`))
}

runServer()
