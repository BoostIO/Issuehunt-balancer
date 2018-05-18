// TODO:: NOT COMPLETED YET

import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class BalanceRefactoring1526354141714 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'balance',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'uuid'
        },
        {
          name: 'uniqueName',
          type: 'varchar',
          isUnique: true,
          length: '255'
        },
        {
          name: 'amount',
          type: 'int'
        },
        {
          name: 'createdDate',
          type: 'date',
          isGenerated: true
        }
      ]
      // uniques: [
      //   {
      //     columnNames: ['uniqueName']
      //   }
      // ],
      // checks: [
      //   {
      //     columnNames: ['amount'],
      //     expression: `"amount" > 0`
      //   }
      // ]
    }))

    // await queryRunner.createTable(new Table({
    //   name: 'transactionLogs',
    //   columns: [
    //     {
    //       name: 'id',
    //       type: 'string',
    //       isPrimary: true,
    //       generationStrategy: 'uuid',
    //       isGenerated: true
    //     },
    //     {
    //       name: 'sender',
    //       type: 'varchar',
    //       isNullable: false,
    //       length: '255'
    //     },
    //     {
    //       name: 'receiver',
    //       type: 'varchar',
    //       isNullable: false,
    //       length: '255'
    //     },
    //     {
    //       name: 'createdDate',
    //       type: 'date'
    //     }
    //   ]
    // }), true)

    // await queryRunner.createForeignKey('transactionLogs', new TableForeignKey({
    //   columnNames: ['balance'],
    //   referencedColumnNames: ['id'],
    //   referencedTableName: 'balanceId',
    //   onDelete: 'CASCADE'
    // }))
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    // const table = await queryRunner.getTable('balance') as Table
    // const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('balanceId') !== -1) as TableForeignKey
    // await queryRunner.dropForeignKey('balance', foreignKey)
    // await queryRunner.dropColumn('balance', 'balanceId')
    // await queryRunner.dropTable('transactionLogs')
    await queryRunner.dropTable('balance')
  }

}
