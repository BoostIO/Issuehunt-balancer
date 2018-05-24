import { HttpError } from 'routing-controllers'

class ClassValidationFail extends HttpError {
  name = 'ClassValidationFail'
  constructor (message?: string) {
    super(400) // Bad Request
    message == null ?
        this.message = 'Class Validation Fails' :
        this.message = message
  }
}

export default ClassValidationFail
