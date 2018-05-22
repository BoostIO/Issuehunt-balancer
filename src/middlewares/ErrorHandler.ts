import express from 'express'
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers'

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

  error (error: any, request: any, response: any, next: express.NextFunction) {
    if (error.httpCode === 404) {
      console.log('Controller error occured')
      return next(error)
    }
    console.log('No value is returned from the controller. Probably occured by not using the registered routes')
    next(error)
  }

}
