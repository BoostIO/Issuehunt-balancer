import chai from 'chai'
import app from '../../app'
import dbLib from '../dbLib'

import { Repository, getManager } from 'typeorm'
import { Balance } from '../../entity/Balance'

describe('Balance controller', () => {

  beforeAll(dbLib.connectDB)
  afterEach(dbLib.initializeEntityID)

  it('delete a balance', async () => {
    await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11:111',
        amount: 100
      })

    const result = await chai.request(app)
      .post('/balances/delete')
      .send({
        uniqueName: '11:111'
      })

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)).toEqual({
      raw: []
    })
  })

  it('registers a balance', async () => {
    const result = await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11:111',
        amount: 100
      })

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)).toEqual({
      id: 1,
      uniqueName: '11:111',
      amount: 100
    })
  })

  it('throw error when balance is registered twice with same uniqueName', async () => {
    await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11:111',
        amount: 100
      })

    const result = await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11:111',
        amount: 100
      })

    expect(result.status).toEqual(409)
    expect(JSON.parse(result.text)).toEqual(
      { message: 'Balance is already registered',
        name: 'BalanceAlreadyExist',
        status: 409 }
    )
  })

  it('throw error when registers a balance with improper uniqueName', async () => {
    const result = await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11-_;111',
        amount: 1
      })

    expect(result.status).toEqual(400)
    expect(JSON.parse(result.text)).toEqual(
      { message: 'child "uniqueName" fails because ["uniqueName" with value "11-_;111" fails to match the required pattern: /^([1-9]+)(\\:[1-9]+)?$/]',
        name: 'ClassValidationFail',
        status: 400 }
    )

  })

  it('throw error when registers a balance with negative integer amount', async () => {
    const result = await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11:111',
        amount: -1
      })

    expect(result.status).toEqual(400)
    expect(JSON.parse(result.text)).toEqual(
      { message: 'child "amount" fails because ["amount" must be larger than or equal to 1]',
        name: 'ClassValidationFail',
        status: 400 }
    )

  })

  it('throw error when registers a balance of decimal amount', async () => {
    const result = await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11:111',
        amount: 1.11
      })

    expect(result.status).toEqual(400)
    expect(JSON.parse(result.text)).toEqual(
      { message: 'child "amount" fails because ["amount" must be an integer]',
        name: 'ClassValidationFail',
        status: 400 }
    )

  })

  it('throw error when finds a not registered balance', async () => {
    const result = await chai.request(app)
      .get('/balances/11:111')

    expect(result.status).toEqual(404)
    expect(JSON.parse(result.text)).toEqual(
      { message: 'Balance does not exist. Create a Balance first',
        name: 'BalanceNotFound',
        status: 404 }
    )

  })

  it('finds a one balance', async () => {
    const balanceRepository: Repository<Balance> = getManager().getRepository(Balance)
    const balance: Balance = balanceRepository.create({
      uniqueName: '11:111',
      amount: 100
    })

    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(balance)
    })

    const result = await chai.request(app)
      .get('/balances/11:111')

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)).toEqual({
      id: 1,
      uniqueName: '11:111',
      amount: 100
    })

  })

  it('finds all registered balances', async () => {
    const balanceRepository: Repository<Balance> = getManager().getRepository(Balance)
    const balance: Balance = balanceRepository.create({
      uniqueName: '11:111',
      amount: 100
    })
    const balance2: Balance = balanceRepository.create({
      uniqueName: '22:222',
      amount: 200
    })

    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(balance)
      await transactionalEntityManager.save(balance2)
    })

    const result = await chai.request(app)
      .get('/balances')

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)[0]).toEqual({
      id: 1,
      uniqueName: '11:111',
      amount: 100
    })
    expect(JSON.parse(result.text)[1]).toEqual({
      id: 2,
      uniqueName: '22:222',
      amount: 200
    })

  })

})
