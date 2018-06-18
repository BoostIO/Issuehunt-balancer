import { createConnection, getConnectionOptions } from 'typeorm'
export const createTypeormConnection = async () => {
  const connectionOptions = await getConnectionOptions('default')

  return createConnection({
    name: 'default',
    ...connectionOptions
  })
}
