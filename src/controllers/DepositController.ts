import { Transaction, TransactionManager, EntityManager } from 'typeorm'
import { Controller, Get, Post, Body } from 'routing-controllers'
import Deposit from '../entities/Deposit'
import Balance from '../entities/Balance'
import Joi from 'joi'
import ValidationError from '../lib/errors/ValidationError'
import {
  DepositCreateBody,
  depositCreateBodySchema
} from '../schemas/deposits'

@Controller()
class DepositController {
  @Get('/deposits')
  async list () {
    const deposits = await Deposit.find()

    return {
      deposits
    }
  }

  @Post('/deposits')
  @Transaction()
  async create (@TransactionManager() manager: EntityManager, @Body() body: DepositCreateBody): Promise<any> {
    const { error, value } = Joi.validate(body, depositCreateBodySchema)
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
      await balance.increaseAmount(amount)
    } catch (error) {
      if (error.name === 'BalanceError') throw new ValidationError(error.message)
      else throw error
    }

    const deposit = await Deposit
      .create({
        balanceId: balance.id,
        amount,
        note
      })
      .save()

    return {
      deposit
    }
  }
}

export default DepositController
