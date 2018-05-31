export interface LogBodyInterface {
  id?: number
  sender: string
  receiver: string
  amount: number | string
}

export interface BalanceBodyInterface {
  id?: number
  uniqueName: string
  amount: number | string
}
