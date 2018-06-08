import chai from 'chai'
import app from '../../app'
import {
  prepareDB,
  deleteAllDataFromDB
} from '../lib/db'
import Balance from '../../entities/Balance'
import Deposit from '../../entities/Deposit'

describe('DepositController', () => {
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
      const deposit = await Deposit
        .create({
          balanceId: balance.id,
          amount: '100',
          note: 'test'
        })
        .save()

      // When
      const response = await chai.request(app)
        .get(`/deposits/${deposit.id}`)

      // Then
      expect(response.body).toMatchObject({
        deposit: {
          id: deposit.id,
          balanceId: balance.id,
          amount: '100',
          note: 'test'
        }
      })
    })

    it('throws an error when the deposit does not exist', async () => {
      // Given
      const depositId = '77777'

      // When
      const response = await chai.request(app)
        .get(`/deposits/${depositId}`)

      // Then
      expect(response.status).toEqual(404)
    })
  })

  describe('list', () => {
    it('shows list of deposits', async () => {
      // Given
      const uniqueName = 'A'
      const balance = await Balance
        .create({
          uniqueName,
          amount: '100'
        })
        .save()
      const deposit = await Deposit
        .create({
          balanceId: balance.id,
          amount: '100',
          note: 'test'
        })
        .save()

      // When
      const response = await chai.request(app)
        .get(`/deposits`)

      // Then
      expect(response.body).toMatchObject({
        deposits: [{
          id: deposit.id,
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
      const depositAmount = '100'
      const response = await chai.request(app)
        .post(`/deposits`)
        .send({
          balanceUniqueName: uniqueName,
          amount: depositAmount,
          note: 'test'
        })

      // Then
      expect(response.body.deposit).toMatchObject({
        id: expect.any(String),
        balanceId: balance.id,
        amount: depositAmount,
        note: 'test'
      })

      const deposit = await Deposit.findOne({
        where: {
          id: response.body.deposit.id
        }
      })
      expect(deposit).toMatchObject({
        id: expect.any(String),
        balanceId: balance.id,
        amount: depositAmount,
        note: 'test'
      })
      const updatedBalance = await Balance.findOne({
        where: {
          uniqueName
        }
      })
      expect(updatedBalance.amount).toBe('200')
    })

    it('throws when given wrong balance unique name', async () => {
      // Given
      const uniqueName = 'A'

      // When
      const depositAmount = '100'
      const response = await chai.request(app)
        .post(`/deposits`)
        .send({
          balanceUniqueName: uniqueName,
          amount: depositAmount
        })

      // Then
      expect(response.body).toEqual({
        name: 'UnprocessableEntityError',
        message: 'The balance does not exist.',
        status: 422
      })
      expect(response.status).toEqual(422)
    })
  })
})
