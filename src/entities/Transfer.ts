import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity('transfers')
class Transfer extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column('bigint')
  senderId!: string

  @Column('bigint')
  receiverId!: string

  @Column('bigint')
  amount!: string

  @Column('text')
  note!: string

  @CreateDateColumn()
  createdDate!: Date
}

export default Transfer
