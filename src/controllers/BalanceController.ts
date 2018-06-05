import { Controller, Param, Get, Post, Body } from 'routing-controllers'
import Joi from 'joi'
import Balance from '../entities/Balance'
import {
  NotFoundError,
  ConflictError
} from '../lib/errors'
import {
  BalanceCreateBody,
  balanceCreateBodySchema
} from '../schemas/balances'

@Controller()
export class BalanceController {
  @Get('/balances/:uniqueName')
  async show (@Param('uniqueName') uniqueName: string) {
    const balance = await Balance.findOne({
      where: {
        uniqueName
      }
    })

    if (balance == null) throw new NotFoundError('The balance does not exist.')

    return {
      balance
    }
  }

  @Post('/balances')
  async create (@Body() body: BalanceCreateBody) {
    const { error, value } = Joi.validate(body, balanceCreateBodySchema)
    if (error != null) throw error
    const {
      uniqueName,
      amount
    } = value

    let balance = await Balance.findOne({
      where: {
        uniqueName
      }
    })
    if (balance != null) throw new ConflictError('The given uniqueName is already taken.')

    balance = new Balance()
    balance.uniqueName = uniqueName
    balance.amount = amount
    await balance.save()

    return {
      balance
    }
  }
}
