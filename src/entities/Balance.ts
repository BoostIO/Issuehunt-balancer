import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Check } from 'typeorm'

@Entity('balances')
@Check(`"amount" >= 0`)
class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column('varchar', { length: 255, unique: true })
  uniqueName!: string

  @Column('bigint')
  amount!: string
}

export default Balance
