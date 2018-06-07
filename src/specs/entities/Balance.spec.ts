import Balance from '../../entities/Balance'
import {
  prepareDB,
  deleteAllDataFromDB
} from '../lib/db'
import { PostgresqlBigIntegerRange } from '../../lib/consts'

describe('Balance', () => {
  beforeAll(prepareDB)
  afterEach(deleteAllDataFromDB)

  describe('#increaseAmount', () => {
    it('increases amount', async () => {
      // Given
      const uniqueName = 'tango'
      const balance = new Balance()
      balance.uniqueName = uniqueName
      balance.amount = '1000'
      await balance.save()

      // Then
      await balance.increaseAmount('100')

      // When
      const updatedBalance = await Balance.findOne({
        uniqueName
      })
      expect(updatedBalance.amount).toEqual('1100')
    })

    it('throws if the given string is not a valid number', async () => {
      // Given
      expect.assertions(1)
      const uniqueName = 'tango'
      const balance = new Balance()
      balance.uniqueName = uniqueName
      balance.amount = '1000'
      await balance.save()

      // When
      try {
        await balance.increaseAmount('amount')
      } catch (error) {
        expect(error).toMatchObject({
          message: 'The given value is not a valid integer.'
        })
      }
    })

    it('throws if the result is exceeding range of big int', async () => {
      // Given
      expect.assertions(1)
      const uniqueName = 'tango'
      const balance = new Balance()
      balance.uniqueName = uniqueName
      balance.amount = `${PostgresqlBigIntegerRange.MAX_BIG_INTEGER}`
      await balance.save()

      // When
      try {
        await balance.increaseAmount('5')
      } catch (error) {
        expect(error).toMatchObject({
          message: 'The result amount is exceeding range of big integer.'
        })
      }
    })
  })

  describe('#decreaseAmount', () => {
    it('decreases amount', async () => {
      // Given
      const uniqueName = 'tango'
      const balance = new Balance()
      balance.uniqueName = uniqueName
      balance.amount = '1000'
      await balance.save()

      // Then
      await balance.decreaseAmount('100')

      // When
      const updatedBalance = await Balance.findOne({
        uniqueName
      })
      expect(updatedBalance.amount).toEqual('900')
    })

    it('throws if the given string is not a valid number', async () => {
      // Given
      expect.assertions(1)
      const uniqueName = 'tango'
      const balance = new Balance()
      balance.uniqueName = uniqueName
      balance.amount = '1000'
      await balance.save()

      // When
      try {
        await balance.decreaseAmount('amount')
      } catch (error) {
        expect(error).toMatchObject({
          message: 'The given value is not a valid integer.'
        })
      }
    })

    it('throws if the calculated result is negative', async () => {
      // Given
      expect.assertions(1)
      const uniqueName = 'tango'
      const balance = new Balance()
      balance.uniqueName = uniqueName
      balance.amount = '100'
      await balance.save()

      // When
      try {
        await balance.decreaseAmount('200')
      } catch (error) {
        expect(error).toMatchObject({
          message: 'The result amount cannot be negative number.'
        })
      }
    })
  })
})
