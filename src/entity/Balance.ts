import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Check, ManyToOne } from 'typeorm'
import { Log } from './Log'

@Entity('balance')
@Check(`"amount" > 0`)
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { length: 255, unique: true })
  uniqueName!: string

  @Column('int')
  amount!: number

  @ManyToOne(type => Log, log => log.balanceTransactions, { cascade: true })
  balanceTransaction!: Log
}
