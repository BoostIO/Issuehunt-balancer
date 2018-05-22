import { HttpError } from 'routing-controllers'

class BalanceAlreadyExist extends HttpError {
  name = 'BalanceAlreadyExist'
  constructor (message?: string) {
    super(404)
    this.stack = null
    message == null ?
        this.message = 'Balance is already registered' :
        this.message = message
  }
}

export default BalanceAlreadyExist
