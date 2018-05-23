import { HttpError } from 'routing-controllers'

class LogNotFound extends HttpError {
  name = 'LogNotFound'
  constructor (message?: string) {
    super(404)
    this.stack = null
    message == null ?
        this.message = 'Log does not exist. Create a Log first' :
        this.message = message
  }
}

export default LogNotFound
