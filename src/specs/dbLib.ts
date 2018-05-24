import { createTypeormConn } from '../lib/database/createTypeormConn'
import configuration from '../lib/configuration'
import { getConnection, getRepository } from 'typeorm'

const dbLib = {
  async connectDB () {
    if (configuration.nodeEnv !== 'test') throw new Error('You can drop db on test mode only')

    return new Promise(async (resolve, reject) => {
      await createTypeormConn()
      resolve()
    })
  },

  async initializeEntityID () {
    if (configuration.nodeEnv !== 'test') throw new Error('You can drop db on test mode only')

    return new Promise(async (resolve, reject) => {
      const entities = ['Balance', 'Log']
      for (let i = 0; i < entities.length; i++) {
        const allEntities = await getRepository(entities[i]).find({})
        await getRepository(entities[i]).remove(allEntities)
        await getRepository(entities[i]).query(`ALTER SEQUENCE ${entities[i]}_id_seq RESTART WITH 1`)
        // TRUNCATE TABLE ${entities[i]} RESTART IDENTITY --> Somewhat reasons, it occurs error !
      }
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
