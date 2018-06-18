import chai from 'chai'
import app from '../../app'
import {
  prepareDB,
  deleteAllDataFromDB
} from '../lib/db'
import Balance from '../../entities/Balance'
import Deposit from '../../entities/Deposit'
import configuration from '../../configuration'

const defaultQuery = {
  accessToken: configuration.accessToken
}

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
        .query(defaultQuery)

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
        .query(defaultQuery)

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
        .query(defaultQuery)

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
        .query(defaultQuery)

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

    it('creates balance if it does not exist.', async () => {
      // Given
      const uniqueName = 'A'

      // When
      const depositAmount = '100'
      const response = await chai.request(app)
        .post(`/deposits`)
        .query(defaultQuery)
        .send({
          balanceUniqueName: uniqueName,
          amount: depositAmount,
          note: 'test'
        })

      // Then
      const deposit = await Deposit.findOne({
        where: {
          id: response.body.deposit.id
        }
      })
      expect(deposit).toMatchObject({
        id: expect.any(String),
        balanceId: expect.any(String),
        amount: depositAmount,
        note: 'test'
      })
      const updatedBalance = await Balance.findOne({
        where: {
          uniqueName
        }
      })
      expect(updatedBalance.amount).toBe('100')
    })
  })
})
