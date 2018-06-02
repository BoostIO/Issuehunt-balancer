import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'
import { Balance } from './Balance'

@Entity('log')
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column('varchar', { length: 255 })
  sender!: string

  @Column('varchar', { length: 255 })
  receiver!: string

  @CreateDateColumn()
  createdDate!: Date

  @OneToMany(type => Balance, balance => balance.log)
  balances!: Balance[]
}
