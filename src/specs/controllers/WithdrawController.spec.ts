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

  describe('show', () => {
    it('shows a deposit', async () => {
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
          amount: '100',
          note: 'test'
        })
        .save()

      // When
      const response = await chai.request(app)
        .get(`/withdraws/${withdraw.id}`)

      // Then
      expect(response.body).toMatchObject({
        withdraw: {
          id: withdraw.id,
          balanceId: balance.id,
          amount: '100',
          note: 'test'
        }
      })
    })

    it('throws an error when the withdraw does not exist', async () => {
      // Given
      const withdrawId = '77777'

      // When
      const response = await chai.request(app)
        .get(`/withdraws/${withdrawId}`)

      // Then
      expect(response.status).toEqual(404)
    })
  })

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
          amount: '100',
          note: 'test'
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
          amount: '100',
          note: 'test'
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
          amount: withdrawAmount,
          note: 'test'
        })

      // Then
      expect(response.body.withdraw).toMatchObject({
        id: expect.any(String),
        balanceId: balance.id,
        amount: withdrawAmount,
        note: 'test'
      })

      const deposit = await Withdraw.findOne({
        where: {
          id: response.body.withdraw.id
        }
      })
      expect(deposit).toMatchObject({
        id: expect.any(String),
        balanceId: balance.id,
        amount: withdrawAmount,
        note: 'test'
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
          amount: withdrawAmount,
          note: 'test'
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
