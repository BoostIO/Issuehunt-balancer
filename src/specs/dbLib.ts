import { createTypeormConn } from '../lib/database/createTypeormConn'
import configuration from '../lib/configuration'
import { getConnection } from 'typeorm'

const dbLib = {
  async connectDB () {
    if (configuration.nodeEnv !== 'test') throw new Error('You can drop db on test mode only')

    return new Promise(async (resolve, reject) => {
      await createTypeormConn()
      resolve()
    })
  },

  async dropDB () {
    if (configuration.nodeEnv !== 'test') throw new Error('You can drop db on test mode only')

    return new Promise(async (resolve, reject) => {
      await getConnection().dropDatabase()
      await getConnection().close()
      resolve()
    })
  }

}

export default dbLib
