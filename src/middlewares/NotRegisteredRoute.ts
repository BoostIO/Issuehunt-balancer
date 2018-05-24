import { NextFunction, Request, Response } from 'express'
import { Middleware, ExpressMiddlewareInterface, HttpError } from 'routing-controllers'

@Middleware({ type: 'after' })
export class NotRegisteredRoute implements ExpressMiddlewareInterface {

  public use (req: Request, res: Response, next?: NextFunction): any {
    if (!res.headersSent) {
      throw new HttpError(404, 'API does not exist')
    }
  }

}
