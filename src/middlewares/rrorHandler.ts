import express from 'express'
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers'

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

  error (error: any, request: any, response: any, next: express.NextFunction) {
    console.log('Error occured. Something is wrong.')
    next()
  }

}
