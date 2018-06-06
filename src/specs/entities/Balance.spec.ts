import Balance from '../../entities/Balance'
import {
  prepareDB,
  deleteAllDataFromDB
} from '../lib/db'
import {
  MAX_INTEGER
} from '../../lib/consts'

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
          message: 'Invalid integer: amount'
        })
      }
    })

    it('throws if the result is exceeding range of big int', async () => {
      // Given
      expect.assertions(1)
      const uniqueName = 'tango'
      const balance = new Balance()
      balance.uniqueName = uniqueName
      balance.amount = `${MAX_INTEGER}`
      await balance.save()

      // When
      try {
        await balance.increaseAmount(1)
      } catch (error) {
        expect(error).toMatchObject({
          message: 'The calculated value is exceeding range of big integer.'
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
          message: 'Invalid integer: amount'
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
        await balance.decreaseAmount(200)
      } catch (error) {
        expect(error).toMatchObject({
          message: 'The calculated value must not be a negative number.'
        })
      }
    })
  })
})
