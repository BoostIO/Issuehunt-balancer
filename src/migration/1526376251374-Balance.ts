import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class BalanceRefactoring1526354141714 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'log',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'sender',
          type: 'varchar',
          isUnique: false,
          length: '255'
        },
        {
          name: 'receiver',
          type: 'varchar',
          isUnique: false,
          length: '255'
        },
        {
          name: 'createdDate',
          type: 'timestamp',
          default: 'now()'
        }
      ]
    }), true)

    await queryRunner.createTable(new Table({
      name: 'balance',
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
          type: 'bigint'
        },
        {
          name: 'logId',
          type: 'bigint',
          isNullable: true
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
          expression: `"amount" > 0`
        }
      ],
      foreignKeys: [
        {
          columnNames: ['logId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'log'
        }
      ]
    }), true, true)
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable('balance')
    const foreignKey = table.foreignKeys.find(
      fk => {
        return fk.columnNames.indexOf('logId') !== -1
      }
    )

    await queryRunner.dropForeignKey('balance', foreignKey)
    await queryRunner.dropTable('balance')
    await queryRunner.dropTable('log')
  }
}
