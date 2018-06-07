import { Transaction, TransactionManager, EntityManager } from 'typeorm'
import { Controller, Get, Post, Body } from 'routing-controllers'
import Transfer from '../entities/Transfer'
import Balance from '../entities/Balance'
import Joi from 'joi'
import ValidationError from '../lib/errors/ValidationError'
import {
  TransferCreateBody,
  transferCreateBodySchema
} from '../schemas/transfers'

@Controller()
class TransferController {
  @Get('/transfers')
  async list () {
    const transfers: Transfer[] = await Transfer.find()

    return transfers
  }

  @Post('/transfers')
  @Transaction()
  async create (@TransactionManager() manager: EntityManager, @Body() body: TransferCreateBody): Promise<any> {
    const { error, value } = Joi.validate(body, transferCreateBodySchema)
    if (error != null) throw new ValidationError()
    const {
      senderUniqueName,
      receiverUniqueName,
      amount
    } = value

    const senderBalance = await Balance.findOne({
      where: {
        uniqueName: senderUniqueName
      }
    })
    if (senderBalance == null) throw new ValidationError('The sender does not exist.')
    const receiverBalance = await Balance.findOne({
      where: {
        uniqueName: receiverUniqueName
      }
    })
    if (receiverBalance == null) throw new ValidationError('The receiver does not exist.')

    try {
      await senderBalance.decreaseAmount(amount)
      await receiverBalance.increaseAmount(amount)
    } catch (error) {
      if (error.name === 'BalanceError') throw new ValidationError(error.message)
      else throw error
    }

    const transfer = await Transfer
      .create({
        senderId: senderBalance.id,
        receiverId: receiverBalance.id,
        amount
      })
      .save()

    return {
      transfer
    }
  }
}

export default TransferController
