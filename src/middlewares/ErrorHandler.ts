import express from 'express'
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers'

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

  error (error: any, request: any, response: any, next: express.NextFunction) {
    if (error.status === 404) {
      console.log('Controller error occured')
    }
    console.log('No value is returned in the controller, which means probably using not registered routes')
    next()
  }

}
