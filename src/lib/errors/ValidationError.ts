import { HttpError } from 'routing-controllers'

class ValidationError extends HttpError {
  name = 'ValidationError'
  constructor (message?: string) {
    super(422) // Bad Request
    message == null ?
        this.message = 'Class Validation Fails' :
        this.message = message
  }
}

export default ValidationError
