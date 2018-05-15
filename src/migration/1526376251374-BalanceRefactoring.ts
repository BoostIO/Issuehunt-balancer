import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class BalanceRefactoring1526354141714 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'balance',
      columns: [
        {
          name: 'id',
          type: 'string',
          isPrimary: true
        },
        {
          name: 'uniqueName',
          type: 'varchar'
        },
        {
          name: 'amount',
          type: 'int'
        }
      ]
    }), true)

    await queryRunner.createTable(new Table({
      name: 'transactionLogs',
      columns: [
        {
          name: 'id',
          type: 'string',
          isPrimary: true
        },
        {
          name: 'sender',
          type: 'int'
        },
        {
          name: 'receiver',
          type: 'int'
        },
        {
          name: 'createdDate',
          type: 'date'
        },
        {
          name: 'balance',
          type: 'int'
        }
      ]
    }), true)

    await queryRunner.createForeignKey('transactionLogs', new TableForeignKey({
      columnNames: ['balance'],
      referencedColumnNames: ['id'],
      referencedTableName: 'balanceId',
      onDelete: 'CASCADE'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable('balance') as Table
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('balanceId') !== -1) as TableForeignKey
    await queryRunner.dropForeignKey('balance', foreignKey)
    await queryRunner.dropColumn('balance', 'balanceId')
    await queryRunner.dropTable('transactionLogs')
    await queryRunner.dropTable('balance')
  }

}
