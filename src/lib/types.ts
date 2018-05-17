import { Log } from '../entity/Log'

export interface LogInterface {
  id?: number
  sender: string
  receiver: string
  amount: number
  createdDate?: Date
}

export interface BalanceInterface {
  id?: number
  uniqueName: string
  amount: number
  balanceTransaction?: Log
}
