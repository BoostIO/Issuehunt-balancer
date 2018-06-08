import chai from 'chai'
import app from '../../app'
import {
  prepareDB,
  deleteAllDataFromDB
} from '../lib/db'
import Balance from '../../entities/Balance'
import Withdraw from '../../entities/Withdraw'

describe('WithdrawController', () => {
  beforeAll(prepareDB)
  afterEach(deleteAllDataFromDB)

  describe('list', () => {
    it('shows list of withdraws', async () => {
      // Given
      const uniqueName = 'A'
      const balance = await Balance
        .create({
          uniqueName,
          amount: '100'
        })
        .save()
      const withdraw = await Withdraw
        .create({
          balanceId: balance.id,
          amount: '100'
        })
        .save()

      // When
      const response = await chai.request(app)
        .get('/withdraws')

      // Then
      expect(response.body).toMatchObject({
        withdraws: [{
          id: withdraw.id,
          balanceId: balance.id,
          amount: '100'
        }]
      })
    })
  })

  describe('create', () => {
    it('deposits balance', async () => {
      // Given
      const uniqueName = 'A'
      const balance = await Balance
        .create({
          uniqueName,
          amount: '100'
        })
        .save()

      // When
      const withdrawAmount = '100'
      const response = await chai.request(app)
        .post('/withdraws')
        .send({
          balanceUniqueName: uniqueName,
          amount: withdrawAmount
        })

      // Then
      expect(response.body.withdraw).toMatchObject({
        id: expect.any(String),
        balanceId: balance.id,
        amount: withdrawAmount
      })

      const deposit = await Withdraw.findOne({
        where: {
          id: response.body.withdraw.id
        }
      })
      expect(deposit).toMatchObject({
        id: expect.any(String),
        balanceId: balance.id,
        amount: withdrawAmount
      })
      const updatedBalance = await Balance.findOne({
        where: {
          uniqueName
        }
      })
      expect(updatedBalance.amount).toBe('0')
    })

    it('throws when given wrong balance unique name', async () => {
      // Given
      const uniqueName = 'A'
      await Balance
        .create({
          uniqueName,
          amount: '100'
        })
        .save()

      // When
      const withdrawAmount = '200'
      const response = await chai.request(app)
        .post('/withdraws')
        .send({
          balanceUniqueName: uniqueName,
          amount: withdrawAmount
        })

      // Then
      expect(response.body).toEqual({
        name: 'UnprocessableEntityError',
        message: 'The result amount cannot be negative number.',
        status: 422
      })
      expect(response.body.status).toBe(422)
    })
  })
})
