import Joi from 'joi'
import { amountConstraint, uniqueNameConstraint } from './sharedConstraints'

export interface TransferCreateBody {
  receiverUniqueName: string
  senderUniqueName: string
  amount: string
  note: string
}

export const transferCreateBodySchema = Joi.object({
  receiverUniqueName: uniqueNameConstraint,
  senderUniqueName: uniqueNameConstraint,
  amount: amountConstraint,
  note: Joi.string().required()
})
