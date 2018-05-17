import { getManager, getRepository, Transaction, TransactionManager, EntityManager, Repository } from 'typeorm'
import { Log } from '../entity/Log'
import { Controller, Param, Get, Post, Body } from 'routing-controllers'
import { Balance } from '../entity/Balance'
import { LogInterface } from '../lib/types'
import BalanceNotFound from '../lib/errors/BalanceNotFound'
import Joi from 'joi'
import { logBodySchema } from '../constraints/schemas'
import ClassValidationFail from '../lib/errors/ClassValidationFail'
import LogNotFound from '../lib/errors/LogNotFound'

@Controller()
export class LogController {
  private balanceRepository: Repository<Balance> = getRepository(Balance)
  private logRepository: Repository<Log> = getRepository(Log)

  @Get('/logs')
  async getAll () {
    const logs: Log[] = await getManager().find(Log)
    if (logs.length === 0) throw new LogNotFound()
    return logs
  }

  @Get('/logs/sender/:uniqueName')
  async getSender (@Param('uniqueName') uniqueName: string) {
    const logs: Log[] = await this.logRepository.find({ sender: uniqueName })
    if (logs.length === 0) throw new LogNotFound()
    return logs
  }

  @Get('/logs/receiver/:uniqueName')
  async getReceiver (@Param('uniqueName') uniqueName: string) {
    const logs: Log[] = await this.logRepository.find({ receiver: uniqueName })
    if (logs.length === 0) throw new LogNotFound()
    return logs
  }

  @Post('/logs/transfer')
  @Transaction()
  async createLog (@TransactionManager() manager: EntityManager, @Body() body: LogInterface): Promise<any> {
    const { error, value } = Joi.validate<LogInterface>(body, logBodySchema)
    if (error != null) throw (new ClassValidationFail()).message = error.message
    const validatedSenderId = value.sender
    const validatedReceiverId = value.receiver
    const validatedAmount = value.amount

    const sender: Balance = await this.balanceRepository.findOne({ uniqueName: validatedSenderId })
    const receiver: Balance = await this.balanceRepository.findOne({ uniqueName: validatedReceiverId })
    if (sender == null || receiver == null) throw new BalanceNotFound()

    sender.amount = sender.amount - validatedAmount
    receiver.amount = receiver.amount + validatedAmount

    await manager.save(sender)
    await manager.save(receiver)

    const log: Log = this.logRepository.create({
      sender: validatedSenderId,
      receiver: validatedReceiverId,
      balanceTransactions: [sender, receiver]
    })

    return manager.save(log)
  }
}
