import chai from 'chai'
import dbLib from './dbLib'
import app from '../app'

describe('Access to not registered routes', () => {
  beforeEach(dbLib.connectDB)
  afterEach(dbLib.initializeEntityID)

  it('does not registered route', async () => {
    const result = await chai.request(app)
      .get('/notRegisteredRoute')

    expect(result.status).toEqual(404)
    expect(JSON.parse(result.text))
      .toEqual({
        'message': 'API does not exist', 'name': 'Error', 'status': 404
      })
  })
})
