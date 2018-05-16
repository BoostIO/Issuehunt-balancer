import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm'
import { Balance } from './Balance'

@Entity('log')
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { length: 255 })
  sender!: string

  @Column('varchar', { length: 255 })
  receiver!: string

  @CreateDateColumn()
  createdDate!: Date

  @OneToMany(type => Balance, balance => balance.balanceTransaction)
  @JoinColumn()
  balanceTransactions!: Balance[]
}

// repo:${repositoryGithubId}
// issue:${repositoryGithubId}:${issueNumber}
// user:${userGithubId}
