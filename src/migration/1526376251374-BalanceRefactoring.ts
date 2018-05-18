import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class BalanceRefactoring1526354141714 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'log',
      columns: [
        {
          name: 'id',
          type: 'integer', // postgresql, mysql
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'sender',
          type: 'varchar', // postgresql, mysql
          isUnique: false,
          length: '255'
        },
        {
          name: 'receiver',
          type: 'varchar', // postgresql, mysql
          isUnique: false,
          length: '255'
        },
        {
          name: 'createdDate',
          type: 'timestamp', // postgresql, mysql
          default: 'now()'
        }
      ]
    }), true)

    await queryRunner.createTable(new Table({
      name: 'balance',
      columns: [
        {
          name: 'id',
          type: 'integer', // postgresql, mysql
          // postgresql, mysql = uuid : varchar
          // https://github.com/typeorm/typeorm/blob/ba5d0aa485a5e260fa6a5399e0b6fe4cb1601012/src/driver/mysql/MysqlDriver.ts#L464
          // https://github.com/typeorm/typeorm/blob/ba5d0aa485a5e260fa6a5399e0b6fe4cb1601012/src/driver/postgres/PostgresDriver.ts#L294
          // https://github.com/typeorm/typeorm/blob/ba5d0aa485a5e260fa6a5399e0b6fe4cb1601012/test/functional/uuid/postgres/uuid-postgres.ts#L21
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'uniqueName',
          type: 'varchar', // postgresql, mysql
          isUnique: true,
          length: '255'
        },
        {
          name: 'amount',
          type: 'bigint' // postgresql, mysql
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

    // NOTE :: In this case, query goes totally different from the above
    // await queryRunner.createForeignKey('balance', new TableForeignKey({
    //   columnNames: ['logId'],
    //   referencedColumnNames: ['id'],
    //   referencedTableName: 'log'
    // }))
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
