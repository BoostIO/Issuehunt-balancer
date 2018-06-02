import { createConnection, getConnectionOptions } from 'typeorm'
import configuration from '../../configuration'

export const createTypeormConn = async () => {
  const connectionOptions = await getConnectionOptions(configuration.dbConnectionName)
  return createConnection({ ...connectionOptions, name: 'default' })
}
