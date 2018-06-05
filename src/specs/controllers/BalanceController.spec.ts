import chai from 'chai'
import app from '../../app'
import {
  prepareDB,
  deleteAllDataFromDB
} from '../lib/db'
import Balance from '../../entities/Balance'

describe('BalanceController', () => {
  beforeAll(prepareDB)
  afterEach(deleteAllDataFromDB)

  describe('show', () => {
    it('shows a balance', async () => {
      // Given
      const balanceUniqueName = 'tango'
      const balanceAmount = '100'
      const balance = new Balance()
      balance.uniqueName = balanceUniqueName
      balance.amount = balanceAmount
      await balance.save()

      // When
      const response = await chai.request(app)
        .get(`/balances/${balanceUniqueName}`)

      // Then
      expect(response.body).toMatchObject({
        balance: {
          id: expect.any(String),
          uniqueName: balanceUniqueName,
          amount: balanceAmount
        }
      })
    })

    it('throws an error when the balance does not exist', async () => {
      // Given
      const balanceUniqueName = 'tango'

      // When
      const response = await chai.request(app)
        .get(`/balances/${balanceUniqueName}`)

      // Then
      expect(response.status).toEqual(404)
    })
  })

  describe('create', () => {
    it('creates a balance', async () => {
      // Given
      const uniqueName = 'tango'
      const amount = '100'

      // When
      const response = await chai.request(app)
        .post(`/balances`)
        .send({
          uniqueName,
          amount
        })

      // Then
      const balanceMatcher = {
        id: expect.any(String),
        uniqueName,
        amount
      }
      expect(response.body).toMatchObject({
        balance: balanceMatcher
      })
      const balance = await Balance.findOne({
        where: {
          uniqueName
        }
      })
      expect(balance).toMatchObject(balanceMatcher)
    })

    it('throws a validation error if the given amount is not valid', async () => {
      // Given
      const uniqueName = 'tango'
      const amount = '-100'

      // When
      const response = await chai.request(app)
        .post(`/balances`)
        .send({
          uniqueName,
          amount
        })

      // Then
      expect(response.status).toEqual(422)
    })
  })
})
