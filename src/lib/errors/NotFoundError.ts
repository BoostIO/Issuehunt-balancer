import { HttpError } from 'routing-controllers'

class NotFoundError extends HttpError {
  name = 'NotFoundError'
  constructor (message?: string) {
    super(404, message || 'The resource does not exist.')
  }
}

export default NotFoundError
