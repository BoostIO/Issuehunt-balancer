class BalanceNotFound extends Error {
  constructor (...args: any[]) {
    super(...args)
    Object.defineProperty(this, 'name', {
      value: this.constructor.name
    })
    Object.defineProperty(this, 'status', {
      value: 404
    })

    if (this.message == null || this.message.length === 0) {
      this.message = 'Balance does not exist. Create a Balance first'
    }
  }
}

export default BalanceNotFound
