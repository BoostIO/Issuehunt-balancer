import chai from 'chai'
import db from './lib/db'
import app from '../app'

describe('Access to not registered routes', () => {
  beforeEach(db.connectDB)
  afterEach(db.initializeEntityID)

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
