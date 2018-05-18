import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Check, ManyToOne } from 'typeorm'
import { Log } from './Log'

@Entity('balance')
@Check(`"amount" > 0`)
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column('varchar', { length: 255, unique: true })
  uniqueName!: string

  @Column('int')
  amount!: number | string
  // NOTE :: JS's numbers can't cover bigint's range.

  @ManyToOne(type => Log, log => log.balances, { cascade: true })
  log!: Log
  // NOTE :: differ from DB's name, which created to `logId` automatically.
}
