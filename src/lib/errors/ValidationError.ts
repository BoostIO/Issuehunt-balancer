import { HttpError } from 'routing-controllers'

class UnprocessableEntityError extends HttpError {
  name = 'UnprocessableEntityError'
  constructor (message?: string) {
    super(422, message || 'The given entity is not valid.')
  }
}

export default UnprocessableEntityError
