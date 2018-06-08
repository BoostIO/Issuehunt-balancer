import { Transaction, TransactionManager, EntityManager } from 'typeorm'
import { Controller, Get, Post, Body } from 'routing-controllers'
import Withdraw from '../entities/Withdraw'
import Balance from '../entities/Balance'
import Joi from 'joi'
import ValidationError from '../lib/errors/ValidationError'
import {
  WithdrawCreateBody,
  withdrawCreateBodySchema
} from '../schemas/withdraws'

@Controller()
class WithdrawController {
  @Get('/withdraws')
  async list () {
    const withdraws = await Withdraw.find()

    return {
      withdraws
    }
  }

  @Post('/withdraws')
  @Transaction()
  async create (@TransactionManager() manager: EntityManager, @Body() body: WithdrawCreateBody): Promise<any> {
    const { error, value } = Joi.validate(body, withdrawCreateBodySchema)
    if (error != null) throw new ValidationError()
    const {
      balanceUniqueName,
      amount,
      note
    } = value

    const balance = await Balance.findOne({
      where: {
        uniqueName: balanceUniqueName
      }
    })
    if (balance == null) throw new ValidationError('The balance does not exist.')

    try {
      await balance.decreaseAmount(amount)
    } catch (error) {
      if (error.name === 'BalanceError') throw new ValidationError(error.message)
      else throw error
    }

    const withdraw = await Withdraw
      .create({
        balanceId: balance.id,
        amount,
        note
      })
      .save()

    return {
      withdraw
    }
  }
}

export default WithdrawController
