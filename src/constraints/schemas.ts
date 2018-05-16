import Joi from 'joi'

// repo:${repositoryGithubId}
// issue:${repositoryGithubId}:${issueNumber}
// user:${userGithubId}
export const uniqueNameSchema: Joi.SchemaLike = Joi.string().regex(/^([1-9]+)(\/[1-9]+)?$/).required()

export const balanceBodySchema = Joi.object()
  .keys({
    uniqueName: uniqueNameSchema,
    amount: Joi.number().min(1).integer().positive().required()
  })

export const logBodySchema = Joi.object()
  .keys({
    sender: uniqueNameSchema,
    receiver: uniqueNameSchema,
    amount: Joi.number().min(1).integer().positive().required()
  })
