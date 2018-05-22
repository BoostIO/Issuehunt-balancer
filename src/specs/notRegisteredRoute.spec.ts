import chai from 'chai'
import dbLib from './dbLib'
import app from '../app'

describe('Access to not registered routes', () => {
  beforeEach(dbLib.connectDB)
  afterEach(dbLib.dropDB)

  it('not registered route', async () => {
    await chai.request(app)
      .get('/notRegisteredRoute')
      .then((res) => {
        expect(res.status).toEqual(404)
        expect(res.text).toEqual('API does not exist')
      })
  })
})
