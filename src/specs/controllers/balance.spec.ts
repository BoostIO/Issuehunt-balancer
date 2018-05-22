import chai from 'chai'
import app from '../../app'
import dbLib from '../dbLib'

import { Repository, getManager } from 'typeorm'
import { Balance } from '../../entity/Balance'

describe('Test a Balance controller', () => {

  beforeEach(dbLib.connectDB)
  afterEach(dbLib.dropDB)

  it('register a balance', async () => {
    await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11:111',
        amount: 100
      })
      .then(function (res) {
        expect(res.status).toEqual(200)
        expect(JSON.parse(res.text)).toEqual({
          id: 1,
          uniqueName: '11:111',
          amount: 100
        })
      })
  })

  it('register a balance twice with same uniqueName', async () => {
    await chai.request(app)
      .post('/balances')
      .send({
        uniqueName: '11:111',
        amount: 100
      })
      .then(function (res) {
        expect(res.status).toEqual(200)
        expect(JSON.parse(res.text)).toEqual({
          id: 1,
          uniqueName: '11:111',
          amount: 100
        })
      })

    await chai.request(app)
    .post('/balances')
    .send({
      uniqueName: '11:111',
      amount: 100
    })
    .then(function (res) {
      expect(res.status).toEqual(404)
      expect(res.text).toEqual('Balance is already registered')
    })
  })

  it('register a balance with improper uniqueName', async () => {
    await chai.request(app)
    .post('/balances')
    .send({
      uniqueName: '11-_;111',
      amount: 1
    })
    .then(function (res) {
      expect(res.status).toEqual(404)
      expect(res.text).toEqual('child \"uniqueName\" fails because [\"uniqueName\" with value \"11-_;111\" fails to match the required pattern: /^([1-9]+)(\\:[1-9]+)?$/]')
    })
  })

  it('register a balance with negative integer amount', async () => {
    await chai.request(app)
    .post('/balances')
    .send({
      uniqueName: '11:111',
      amount: -1
    })
    .then(function (res) {
      expect(res.status).toEqual(404)
      expect(res.text).toEqual('child "amount" fails because ["amount" must be larger than or equal to 1]')
    })
  })

  it('register a balance of decimal amount', async () => {
    await chai.request(app)
    .post('/balances')
    .send({
      uniqueName: '11:111',
      amount: 1.11
    })
    .then(function (res) {
      expect(res.status).toEqual(404)
      expect(res.text).toEqual('child "amount" fails because ["amount" must be an integer]')
    })
  })

  it('find a not registered balance', async () => {
    await chai.request(app)
      .get('/balances/11:111')
      .then(function (res) {
        expect(res.status).toEqual(404)
        expect(res.text).toEqual('Balance does not exist. Create a Balance first')
      })
      .catch(function (err) {
        throw err
      })
  })

  it('find a one balance', async () => {
    const balanceRepository: Repository<Balance> = getManager().getRepository(Balance)
    const balance: Balance = balanceRepository.create({
      uniqueName: '11:111',
      amount: 100
    })

    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(balance)
    })

    await chai.request(app)
      .get('/balances/11:111')
      .then(function (res) {
        expect(res.status).toEqual(200)
        expect(JSON.parse(res.text)).toEqual({
          id: 1,
          uniqueName: '11:111',
          amount: 100
        })
      })
      .catch(function (err) {
        throw err
      })
  })

  it('find all registered balances', async () => {
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

    await chai.request(app)
      .get('/balances')
      .then(function (res) {
        expect(res.status).toEqual(200)
        expect(JSON.parse(res.text)[0]).toEqual({
          id: 1,
          uniqueName: '11:111',
          amount: 100
        })
        expect(JSON.parse(res.text)[1]).toEqual({
          id: 2,
          uniqueName: '22:222',
          amount: 200
        })
      })
      .catch(function (err) {
        throw err
      })
  })

})
