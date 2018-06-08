import Express from 'express'
import bodyParser from 'body-parser'
import { useExpressServer } from 'routing-controllers'
import BalanceController from './controllers/BalanceController'
import TransferController from './controllers/TransferController'
import DepositController from './controllers/DepositController'
import ErrorHandlingMiddleware from './middlewares/ErrorHandlingMiddleware'
import NotFoundMiddleware from './middlewares/NotFoundMiddleware'

const app = Express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

useExpressServer(app, {
  defaultErrorHandler: false,
  controllers: [
    BalanceController,
    TransferController,
    DepositController
  ],
  middlewares: [
    NotFoundMiddleware,
    ErrorHandlingMiddleware
  ]
})

export default app
