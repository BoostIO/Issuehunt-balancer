import { getManager, getRepository, Transaction, TransactionManager, EntityManager } from 'typeorm'
import { Log } from '../entity/Log'
import { Controller, Param, Get, Post, Body } from 'routing-controllers'
import { Balance } from '../entity/Balance'
import { LogBodyInterface } from '../lib/types'
import BalanceNotFound from '../lib/errors/BalanceNotFound'
import Joi from 'joi'
import { logBodySchema } from '../constraints/schemas'
import ClassValidationFail from '../lib/errors/ClassValidationFail'
import LogNotFound from '../lib/errors/LogNotFound'

@Controller()
export class LogController {
  @Get('/logs')
  async getAll () {
    const logs: Log[] = await getManager().find(Log)
    if (logs.length === 0) throw new LogNotFound()
    return logs
  }

  @Get('/logs/sender/:uniqueName')
  async getSender (@Param('uniqueName') uniqueName: string) {
    const logs: Log[] = await getRepository(Log).find({ sender: uniqueName })
    if (logs.length === 0) throw new LogNotFound()
    return logs
  }

  @Get('/logs/receiver/:uniqueName')
  async getReceiver (@Param('uniqueName') uniqueName: string) {
    const logs: Log[] = await getRepository(Log).find({ receiver: uniqueName })
    if (logs.length === 0) throw new LogNotFound()
    return logs
  }

  @Post('/logs/transfer')
  @Transaction()
  async createLog (@TransactionManager() manager: EntityManager, @Body() body: LogBodyInterface): Promise<any> {
    const { error, value } = Joi.validate<LogBodyInterface>(body, logBodySchema)
    if (error != null) throw new ClassValidationFail()
    const validatedSenderId = value.sender
    const validatedReceiverId = value.receiver
    const validatedAmount = parseInt(`${value.amount}`, 10)

    const sender: Balance = await getRepository(Balance).findOne({ uniqueName: validatedSenderId })
    const receiver: Balance = await getRepository(Balance).findOne({ uniqueName: validatedReceiverId })
    if (sender == null || receiver == null) throw new BalanceNotFound()

    sender.amount = parseInt(`${sender.amount}`, 10) - validatedAmount
    receiver.amount = parseInt(`${receiver.amount}`, 10) + validatedAmount

    try {
      await manager.save(sender)
      await manager.save(receiver)
    } catch (e) {
      throw new ClassValidationFail()
    }

    const log: Log = getRepository(Log).create({
      sender: validatedSenderId,
      receiver: validatedReceiverId,
      balances: [sender, receiver]
    })

    return manager.save(log)
  }
}
