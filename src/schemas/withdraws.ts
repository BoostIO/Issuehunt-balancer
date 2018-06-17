import Joi from 'joi'
import { uniqueNameConstraint, amountConstraint } from './sharedConstraints'

export interface WithdrawCreateBody {
  balanceUniqueName: string
  amount: string
  note: string
}

export const withdrawCreateBodySchema = Joi.object({
  balanceUniqueName: uniqueNameConstraint,
  amount: amountConstraint,
  note: Joi.string().required()
})
