import chai from 'chai'
import app from '../app'

describe('Access to not registered routes', () => {
  it('does not registered route', async () => {
    const result = await chai.request(app)
      .get('/notRegisteredRoute')

    expect(JSON.parse(result.text))
      .toEqual({
        message: 'The given route does not exist.',
        name: 'Error',
        status: 404
      })
    expect(result.status).toEqual(404)
  })
})
