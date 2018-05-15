import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { Balance } from './Balance'

@Entity()
export class TransactionLogs {

  @PrimaryGeneratedColumn('uuid')
    id!: string

  @Column('int')
    sender!: number

  @Column('int')
    receiver!: number

  @CreateDateColumn()
    createdDate!: Date

  @OneToOne(type => Balance)
  @JoinColumn()
    balanceId!: Balance
}
