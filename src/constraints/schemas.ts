import Joi from 'joi'

// # TYPE OF UNIQUE NAMES
// repo:${repositoryGithubId}
// issue:${repositoryGithubId}:${issueNumber}
// user:${userGithubId}

export const uniqueNameSchemaLike: Joi.SchemaLike = Joi.string().regex(/^([1-9]+)(\:[1-9]+)?$/).required()

export const uniqueNameSchema = Joi.object()
  .keys({
    uniqueName: uniqueNameSchemaLike
  })

export const balanceBodySchema = Joi.object()
  .keys({
    uniqueName: uniqueNameSchemaLike,
    amount: Joi.number().min(1).integer().positive().required()
  })

export const logBodySchema = Joi.object()
  .keys({
    sender: uniqueNameSchemaLike,
    receiver: uniqueNameSchemaLike,
    amount: Joi.number().min(1).integer().positive().required()
  })
