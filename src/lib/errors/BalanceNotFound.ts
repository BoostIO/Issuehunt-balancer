import { HttpError } from 'routing-controllers'

class BalanceNotFound extends HttpError {
  name = 'BalanceNotFound'
  constructor (message?: string) {
    super(404)
    this.stack = null
    message == null ?
        this.message = 'Balance does not exist. Create a Balance first' :
        this.message = message
  }
}

export default BalanceNotFound
