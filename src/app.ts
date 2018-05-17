import Express from 'express'
import bodyParser from 'body-parser'
import { useExpressServer } from 'routing-controllers'
import { BalanceController } from './controllers/BalanceController'
import { CustomErrorHandler } from './middlewares/ErrorHandler'
import { LogController } from './controllers/LogController'
import { NotRegisteredRoute } from './middlewares/NotRegisteredRoute'

const app = Express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

useExpressServer(app, {
  controllers: [
    BalanceController,
    LogController
  ],
  middlewares: [
    NotRegisteredRoute,
    CustomErrorHandler
  ]
})

export default app
