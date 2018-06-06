import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Check, getManager } from 'typeorm'
import BigInt from 'big-integer'
import {
  MAX_INTEGER
} from '../lib/consts'

@Entity('balances')
@Check(`"amount" >= 0`)
class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column('varchar', { length: 255, unique: true })
  uniqueName!: string

  @Column('bigint')
  amount!: string

  async increaseAmount (value: string | number) {
    const valueInBigInt = BigInt(value as number)
    if (!valueInBigInt.isPositive()) throw new Error('The given value must be positive number.')
    const resultValueInBigInt = valueInBigInt.plus(this.amount)
    if (resultValueInBigInt.compareTo(MAX_INTEGER) === 1) throw new Error('The calculated value is exceeding range of big integer.')

    return getManager()
      .createQueryBuilder(Balance, 'entity')
      .update(Balance)
      .set({
        amount: () => `amount + ${valueInBigInt.toString()}`
      })
      .where({
        id: this.id
      })
      .execute()
  }

  async decreaseAmount (value: string | number) {
    const valueInBigInt = BigInt(value as number)
    if (!valueInBigInt.isPositive()) throw new Error('The value must be a positive number.')
    const resultValueInBigInt = BigInt(this.amount).minus(valueInBigInt)
    if (resultValueInBigInt.isNegative()) throw new Error('The calculated value must not be a negative number.')

    return getManager()
      .createQueryBuilder(Balance, 'entity')
      .update(Balance)
      .set({
        amount: () => `amount - ${valueInBigInt.toString()}`
      })
      .where({
        id: this.id
      })
      .execute()
  }
}

export default Balance
