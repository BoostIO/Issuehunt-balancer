import { getManager, Transaction, TransactionManager, EntityManager, Repository } from 'typeorm'
import { Balance } from '../entity/Balance'
import { Controller, Param, Get, Post, Body } from 'routing-controllers'
import { BalanceBodyInterface } from '../lib/types'
import BalanceAlreadyExist from '../lib/errors/BalanceAlreadyExist'
import ClassValidationFail from '../lib/errors/ClassValidationFail'
import Joi from 'joi'
import { balanceBodySchema, uniqueNameSchema } from '../constraints/schemas'
import BalanceNotFound from '../lib/errors/BalanceNotFound'

@Controller()
export class BalanceController {

  private balanceRepository: Repository<Balance>

  constructor () {
    this.balanceRepository = getManager().getRepository(Balance)
  }

  @Get('/balances')
  async getAll () {
    const balances: Balance[] = await getManager().find(Balance)
    if (balances.length === 0) throw new BalanceNotFound()
    return balances
  }

  @Get('/balances/:uniqueName')
  async getOne (@Param('uniqueName') uniqueName: string) {
    const { error, value } = Joi.validate<any>(uniqueName, uniqueNameSchema)
    if (error != null) return (new ClassValidationFail()).message = error.message

    const balance: Balance = await this.balanceRepository.findOne({ uniqueName: value })
    if (balance == null) throw new BalanceNotFound()

    return balance
  }

  @Post('/balances')
  @Transaction()
  async createOne (@TransactionManager() manager: EntityManager, @Body() body: BalanceBodyInterface): Promise<any> {

    const { error, value } = Joi.validate<BalanceBodyInterface>(body, balanceBodySchema)
    if (error != null) throw (new ClassValidationFail()).message = error.message
    let { uniqueName, amount } = value
    amount = parseInt(`${amount}`, 10)

    const balance: Balance = await this.balanceRepository.findOne({ uniqueName })
    if (balance != null) throw new BalanceAlreadyExist()

    const newBalance: Balance = this.balanceRepository.create({
      uniqueName,
      amount
    })

    return manager.save(newBalance)
  }
}
