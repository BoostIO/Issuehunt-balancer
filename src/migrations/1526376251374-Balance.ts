import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class BalanceRefactoring1526354141714 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'transfers',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'senderId',
          type: 'bigint'
        },
        {
          name: 'receiverId',
          type: 'bigint'
        },
        {
          name: 'amount',
          type: 'bigint'
        },
        {
          name: 'createdDate',
          type: 'timestamp',
          default: 'now()'
        }
      ]
    }), true)

    await queryRunner.createTable(new Table({
      name: 'deposits',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'balanceId',
          type: 'bigint'
        },
        {
          name: 'amount',
          type: 'bigint'
        },
        {
          name: 'createdDate',
          type: 'timestamp',
          default: 'now()'
        }
      ]
    }), true)

    await queryRunner.createTable(new Table({
      name: 'withdraws',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'balanceId',
          type: 'bigint'
        },
        {
          name: 'amount',
          type: 'bigint'
        },
        {
          name: 'createdDate',
          type: 'timestamp',
          default: 'now()'
        }
      ]
    }), true)

    await queryRunner.createTable(new Table({
      name: 'balances',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'uniqueName',
          type: 'varchar',
          isUnique: true,
          length: '255'
        },
        {
          name: 'amount',
          type: 'bigint',
          default: 0
        }
      ],
      uniques: [
        {
          columnNames: ['uniqueName']
        }
      ],
      checks: [
        {
          columnNames: ['amount'],
          expression: `"amount" >= 0`
        }
      ]
    }), true)

    await queryRunner.createForeignKeys('transfers', [
      new TableForeignKey({
        columnNames: ['senderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'balances',
        onDelete: 'CASCADE'
      }),
      new TableForeignKey({
        columnNames: ['receiverId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'balances',
        onDelete: 'CASCADE'
      })
    ])
    await queryRunner.createForeignKey('deposits', new TableForeignKey({
      columnNames: ['balanceId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'balances',
      onDelete: 'CASCADE'
    }))
    await queryRunner.createForeignKey('withdraws', new TableForeignKey({
      columnNames: ['balanceId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'balances',
      onDelete: 'CASCADE'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('transfers')
    await queryRunner.dropTable('deposits')
    await queryRunner.dropTable('withdraws')
    await queryRunner.dropTable('balances')
  }
}
