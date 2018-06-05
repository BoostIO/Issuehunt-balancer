import Express from 'express'
import bodyParser from 'body-parser'
import { useExpressServer } from 'routing-controllers'
import { BalanceController } from './controllers/BalanceController'
import ErrorHandlingMiddleware from './middlewares/ErrorHandlingMiddleware'
import TransferController from './controllers/TransferController'
import NotFoundMiddleware from './middlewares/NotFoundMiddleware'

const app = Express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

useExpressServer(app, {
  defaultErrorHandler: false,
  controllers: [
    BalanceController,
    TransferController
  ],
  middlewares: [
    NotFoundMiddleware,
    ErrorHandlingMiddleware
  ]
})

export default app
