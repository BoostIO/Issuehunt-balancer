import chai from 'chai'
import app from '../../app'
import {
  prepareDB,
  deleteAllDataFromDB
} from '../lib/db'
import Balance from '../../entities/Balance'
import Transfer from '../../entities/Transfer'

describe('BalanceController', () => {
  beforeAll(prepareDB)
  afterEach(deleteAllDataFromDB)

  describe('list', () => {
    it('shows list of transfers', async () => {
      // Given
      const uniqueNameA = 'A'
      const uniqueNameB = 'B'
      const balanceA = await Balance
        .create({
          uniqueName: uniqueNameA,
          amount: '100'
        })
        .save()
      const balanceB = await Balance
        .create({
          uniqueName: uniqueNameB,
          amount: '0'
        })
        .save()

      const transfer = await Transfer
        .create({
          senderId: balanceA.id,
          receiverId: balanceB.id,
          amount: '100'
        })
        .save()

      // When
      const response = await chai.request(app)
        .get(`/transfers`)

      // Then
      expect(response.body).toMatchObject({
        transfers: [{
          id: transfer.id
        }]
      })
    })
  })

  describe('create', () => {
    it('transfers balance and records the transferring', async () => {
      // Given
      const uniqueNameA = 'A'
      const uniqueNameB = 'B'
      const balanceA = await Balance
        .create({
          uniqueName: uniqueNameA,
          amount: '100'
        })
        .save()
      const balanceB = await Balance
        .create({
          uniqueName: uniqueNameB,
          amount: '0'
        })
        .save()

      // When
      const transferAmount = '100'
      const response = await chai.request(app)
        .post(`/transfers`)
        .send({
          senderUniqueName: uniqueNameA,
          receiverUniqueName: uniqueNameB,
          amount: transferAmount
        })

      // Then
      expect(response.body.transfer).toMatchObject({
        id: expect.any(String),
        senderId: balanceA.id,
        receiverId: balanceB.id,
        amount: transferAmount
      })

      const transfer = await Transfer.findOne({
        where: {
          id: response.body.transfer.id
        }
      })
      expect(transfer).toMatchObject({
        id: expect.any(String),
        senderId: balanceA.id,
        receiverId: balanceB.id,
        amount: transferAmount
      })
      const updatedBalanceA = await Balance.findOne({
        where: {
          uniqueName: uniqueNameA
        }
      })
      expect(updatedBalanceA.amount).toBe('0')
      const updatedBalanceB = await Balance.findOne({
        where: {
          uniqueName: uniqueNameB
        }
      })
      expect(updatedBalanceB.amount).toBe('100')
    })

    it('throws when given wrong receiver unique name', async () => {
      // Given
      const uniqueNameA = 'A'
      const uniqueNameB = 'B'
      await Balance
        .create({
          uniqueName: uniqueNameA,
          amount: '100'
        })
        .save()

      // When
      const transferAmount = '100'
      const response = await chai.request(app)
        .post(`/transfers`)
        .send({
          senderUniqueName: uniqueNameA,
          receiverUniqueName: uniqueNameB,
          amount: transferAmount
        })

      // Then
      expect(response.body).toEqual({
        name: 'UnprocessableEntityError',
        message: 'The receiver does not exist.',
        status: 422
      })
      expect(response.status).toEqual(422)
    })

    it('throws when given wrong sender unique name', async () => {
      // Given
      const uniqueNameA = 'A'
      const uniqueNameB = 'B'
      await Balance
        .create({
          uniqueName: uniqueNameB,
          amount: '100'
        })
        .save()

      // When
      const transferAmount = '100'
      const response = await chai.request(app)
        .post(`/transfers`)
        .send({
          senderUniqueName: uniqueNameA,
          receiverUniqueName: uniqueNameB,
          amount: transferAmount
        })

      // Then
      expect(response.body).toEqual({
        name: 'UnprocessableEntityError',
        message: 'The sender does not exist.',
        status: 422
      })
      expect(response.status).toEqual(422)
    })

    it('throws when balance of receiver is not enough to send', async () => {
      // Given
      const uniqueNameA = 'A'
      const uniqueNameB = 'B'
      await Balance
        .create({
          uniqueName: uniqueNameA,
          amount: '0'
        })
        .save()
      await Balance
        .create({
          uniqueName: uniqueNameB,
          amount: '0'
        })
        .save()

      // When
      const transferAmount = '100'
      const response = await chai.request(app)
        .post(`/transfers`)
        .send({
          senderUniqueName: uniqueNameA,
          receiverUniqueName: uniqueNameB,
          amount: transferAmount
        })

      // Then
      expect(response.body).toEqual({
        message: 'The result amount cannot be negative number.',
        name: 'UnprocessableEntityError',
        status: 422
      })
      expect(response.status).toEqual(422)
    })
  })
})
