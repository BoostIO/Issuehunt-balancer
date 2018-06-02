import Joi from 'joi'

// # TYPE OF UNIQUE NAMES
// repo:${repositoryGithubId}
// issue:${repositoryGithubId}:${issueNumber}
// user:${userGithubId}
export const UniqueNameConstraint: Joi.SchemaLike = Joi.string().regex(/^([1-9]+)(\:[1-9]+)?$/).required()

export const BalanceDeleteBodySchema = Joi.object()
  .keys({
    uniqueName: UniqueNameConstraint
  })

export const BalanceCreateBodySchema = Joi.object()
  .keys({
    uniqueName: UniqueNameConstraint,
    amount: Joi.number().min(1).integer().positive().required()
  })

export const LogCreateBodySchema = Joi.object()
  .keys({
    sender: UniqueNameConstraint,
    receiver: UniqueNameConstraint,
    amount: Joi.number().min(1).integer().positive().required()
  })
