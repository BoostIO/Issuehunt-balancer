import { request } from 'graphql-request'
import { AddressInfo } from 'net'
import { startServer } from '../../startServer'
import { Balance } from '../../entity/Balance'
import { nameNotLongEnough, amountShouldBePositive } from './errorMessages'

let getHost = () => ''

beforeAll(async () => {
  const app = await startServer()
  const { port } = app.address() as AddressInfo
  getHost = () => `http://127.0.0.1:${port}`
})

const name = 'guieenoutisaa'
const amount = 33

const mutation = (name: string, amount?: number) => `
mutation {
  register(name: "${name}", amount: ${amount}) {
    path
    message
  }
}
`
test('Register balance', async () => {
  // make sure we can register a balance
  const response = await request(getHost(), mutation(name, amount))
  expect(response).toEqual({ register: null })
  const balances = await Balance.find({ where: { name } })
  expect(balances).toHaveLength(1)
  const balance = balances[0]
  expect(balance.name).toEqual(name)

  // catch bad name
  const response2: any = await request(getHost(), mutation('b', amount))
  expect(response2).toEqual({
    register: [
      {
        path: 'name',
        message: nameNotLongEnough
      }
    ]
  })

  // catch bad amount
  const response3: any = await request(getHost(), mutation('asdf', -1))
  expect(response3).toEqual({
    register: [
      {
        path: 'amount',
        message: amountShouldBePositive
      }
    ]
  })

})
