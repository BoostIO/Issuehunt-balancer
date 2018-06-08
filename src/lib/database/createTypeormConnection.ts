import { createConnection, getConnectionOptions } from 'typeorm'
import configuration from '../../configuration'
export const createTypeormConnection = async () => {
  const connectionOptions = await getConnectionOptions(configuration.dbConnectionName)

  return createConnection({
    name: 'default',
    ...connectionOptions
  })
}
