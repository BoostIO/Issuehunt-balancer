import express from 'express'
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers'
import Joi from 'joi'

@Middleware({ type: 'after' })
class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  public error (error: any, request: any, response: any, next: express.NextFunction) {
    const name = error.name
    const status = error.httpCode != null
      ? error.httpCode
      : error.isJoi
        ? 422
        : 500

    const message = error.isJoi
      ? (error as Joi.ValidationError).details.map(detail => detail.message).join(', ')
      : error.message

    response.status(status)
      .json({
        name,
        message,
        status
      })
  }
}

export default CustomErrorHandler
