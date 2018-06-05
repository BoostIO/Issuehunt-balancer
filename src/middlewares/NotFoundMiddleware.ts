import { NextFunction, Request, Response } from 'express'
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { NotFoundError }from '../lib/errors'

@Middleware({ type: 'after' })
class NotRegisteredRoute implements ExpressMiddlewareInterface {
  public use (req: Request, res: Response, next?: NextFunction): any {
    if (!res.headersSent) {
      throw new NotFoundError('The given route does not exist.')
    }
  }
}

export default NotRegisteredRoute
