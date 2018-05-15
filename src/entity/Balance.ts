import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('balance')
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('int')
  amount!: number

}
