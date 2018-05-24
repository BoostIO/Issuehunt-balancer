import express from 'express'
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers'

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

  error (error: any, request: any, response: any, next: express.NextFunction) {
    if (error.httpCode === 500) {
      console.log('SERVER ERROR')
    }

    response.status(error.httpCode || 500)
            .json({
              name   : error.name,
              message: error.message,
              status : error.httpCode
            })
  }

}
