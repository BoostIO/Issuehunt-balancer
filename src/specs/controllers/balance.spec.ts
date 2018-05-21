import chai from 'chai'
import app from '../../app'
import dbLib from '../dbLib'

import { Repository, getManager } from 'typeorm'
import { Balance } from '../../entity/Balance'

describe('Test a balance controller', () => {

  beforeEach(dbLib.connectDB)
  afterEach(dbLib.dropDB)

  it('register balance', async () => {
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

      // to be error ---proceeding !
    await chai.request(app)
    .post('/balances')
    .send({
      uniqueName: '11:111',
      amount: 100
    })
    .then(function (res) {
      console.log(res)
      expect(res.status).toEqual(500)
      expect(JSON.parse(res.text)).toThrowError('BalanceAlreadyExist')
    })
  })

  it('show registered balance', async () => {
    const balanceRepository: Repository<Balance> = getManager().getRepository(Balance)
    const balance: Balance = balanceRepository.create({
      uniqueName: '11:111',
      amount: 100
    })

    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(balance)
    })

    await chai.request(app)
      .get('/balances')
      .then(function (res) {
        expect(res.status).toEqual(200)
        // res.text = [{"id":1,"uniqueName":"11/111","amount":100}]
        expect(JSON.parse(res.text)[0]).toEqual({
          id: 1,
          uniqueName: '11:111',
          amount: 100
        })
      })
      .catch(function (err) {
        throw err
      })
  })

  it('find balance', async () => {
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

})
