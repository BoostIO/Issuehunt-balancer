import Joi from 'joi'

export interface WithdrawCreateBody {
  balanceUniqueName: string
  amount: string
  note: string
}

export const withdrawCreateBodySchema = Joi.object({
  balanceUniqueName: Joi.string(),
  amount: Joi.string().regex(/^[0-9]+$/),
  note: Joi.string()
})
