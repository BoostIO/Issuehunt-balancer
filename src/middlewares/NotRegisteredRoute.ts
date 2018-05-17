import { NextFunction, Request, Response } from 'express'
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'

@Middleware({ type: 'after' })
export class NotRegisteredRoute implements ExpressMiddlewareInterface {

  public use (req: Request, res: Response, next?: NextFunction): void {
    if (!res.headersSent) {
      throw new Error('API does not exist')
    }
  }

}
