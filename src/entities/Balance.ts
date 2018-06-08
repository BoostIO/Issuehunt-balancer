import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Check, getManager } from 'typeorm'
import BigInt from 'big-integer'
import { PostgresqlErrorCodes } from '../lib/consts'

export class BalanceError extends Error {
  name = 'BalanceError'
}

function parseBigInt (value: string) {
  try {
    return BigInt(value)
  } catch (error) {
    if (error.message === 'Invalid integer: amount') throw new BalanceError('The given value is not a valid integer.')
  }
}

@Entity('balances')
@Check(`"amount" >= 0`)
class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column('varchar', { length: 255, unique: true })
  uniqueName!: string

  @Column('bigint')
  amount!: string

  async increaseAmount (value: string) {
    const valueInBigInt = parseBigInt(value)
    if (!valueInBigInt.isPositive()) throw new BalanceError('The given value must be positive number.')

    try {
      return await getManager()
        .createQueryBuilder(Balance, 'entity')
        .update(Balance)
        .set({
          amount: () => `amount + ${valueInBigInt.toString()}`
        })
        .where({
          id: this.id
        })
        .execute()
    } catch (error) {
      if (error.code === PostgresqlErrorCodes.NUMERIC_VALUE_OUT_OF_RANGE) {
        throw new BalanceError('The result amount is exceeding range of big integer.')
      } else {
        throw error
      }
    }
  }

  async decreaseAmount (value: string) {
    const valueInBigInt = parseBigInt(value)
    if (!valueInBigInt.isPositive()) throw new BalanceError('The value must be a positive number.')

    try {
      return await getManager()
        .createQueryBuilder(Balance, 'entity')
        .update(Balance)
        .set({
          amount: () => `amount - ${valueInBigInt.toString()}`
        })
        .where({
          id: this.id
        })
        .execute()
    } catch (error) {
      if (error.code === PostgresqlErrorCodes.CHECK_VIOLATION) {
        throw new BalanceError('The result amount cannot be negative number.')
      } else {
        throw error
      }
    }
  }
}

export default Balance
