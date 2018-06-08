import Joi from 'joi'

export const uniqueNameConstraint: Joi.SchemaLike = Joi.string().required()
export const amountConstraint: Joi.SchemaLike = Joi.string().regex(/^[0-9]+$/).required()
