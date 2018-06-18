import Express from 'express'
import bodyParser from 'body-parser'
import { useExpressServer } from 'routing-controllers'
import BalanceController from './controllers/BalanceController'
import TransferController from './controllers/TransferController'
import DepositController from './controllers/DepositController'
import WithdrawController from './controllers/WithdrawController'
import ErrorHandlingMiddleware from './middlewares/ErrorHandlingMiddleware'
import NotFoundMiddleware from './middlewares/NotFoundMiddleware'
import configuration from './configuration'

const app = Express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
  if (req.query.accessToken === configuration.accessToken) {
    next()
  } else {
    res.status(404).json({
      message: 'Not Found'
    })
  }
})

useExpressServer(app, {
  defaultErrorHandler: false,
  controllers: [
    BalanceController,
    TransferController,
    DepositController,
    WithdrawController
  ],
  middlewares: [
    NotFoundMiddleware,
    ErrorHandlingMiddleware
  ]
})

export default app
