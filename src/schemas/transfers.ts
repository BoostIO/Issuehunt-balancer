import Joi from 'joi'

export interface TransferCreateBody {
  receiverUniqueName: string
  senderUniqueName: string
  amount: string
  note: string
}

export const transferCreateBodySchema = Joi.object({
  receiverUniqueName: Joi.string(),
  senderUniqueName: Joi.string(),
  amount: Joi.string().regex(/^[0-9]+$/),
  note: Joi.string()
})
