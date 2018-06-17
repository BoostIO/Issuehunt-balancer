import Joi from 'joi'
import { amountConstraint, uniqueNameConstraint } from './sharedConstraints'

export interface DepositCreateBody {
  balanceUniqueName: string
  amount: string
  note: string
}

export const depositCreateBodySchema = Joi.object({
  balanceUniqueName: uniqueNameConstraint,
  amount: amountConstraint,
  note: Joi.string().required()
})
