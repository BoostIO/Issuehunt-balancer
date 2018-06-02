import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Check, ManyToOne } from 'typeorm'
import { Log } from './Log'

@Entity('balance')
@Check(`"amount" >= 0`)
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column('varchar', { length: 255, unique: true })
  uniqueName!: string

  @Column('int')
  amount!: number | string

  @ManyToOne(type => Log, log => log.balances, { cascade: true })
  log!: Log
}
