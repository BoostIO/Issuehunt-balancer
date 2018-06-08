import { HttpError } from 'routing-controllers'

class ConflictError extends HttpError {
  name = 'ConflictError'
  constructor (message?: string) {
    super(409, message || 'The request is conflicting with the current status.')
  }
}

export default ConflictError
