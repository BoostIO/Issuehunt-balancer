import Joi from 'joi'

export interface DepositCreateBody {
  balanceUniqueName: string
  amount: string
  note: string
}

export const depositCreateBodySchema = Joi.object({
  balanceUniqueName: Joi.string(),
  amount: Joi.string().regex(/^[0-9]+$/),
  note: Joi.string()
})
