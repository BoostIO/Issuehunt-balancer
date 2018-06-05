import Joi from 'joi'

export interface BalanceCreateBody {
  uniqueName: string
  amount: string
}

export const balanceCreateBodySchema = Joi.object({
  uniqueName: Joi.string(),
  amount: Joi.string().regex(/^[0-9]+$/)
})
