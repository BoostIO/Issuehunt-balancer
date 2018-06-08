import Joi from 'joi'
import { uniqueNameConstraint, amountConstraint } from './sharedConstraints'

export interface BalanceCreateBody {
  uniqueName: string
  amount: string
}

export const balanceCreateBodySchema = Joi.object({
  uniqueName: uniqueNameConstraint,
  amount: amountConstraint
})
