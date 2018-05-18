import { Log } from '../entity/Log'
import { Balance } from '../entity/Balance'

export interface LogBodyInterface {
  id?: number
  sender: string
  receiver: string
  amount: number | string
  createdDate?: Date
  balanceTransactions?: Balance[]
}

export interface BalanceBodyInterface {
  id?: number
  uniqueName: string
  amount: number | string
  balanceTransaction?: Log
}
