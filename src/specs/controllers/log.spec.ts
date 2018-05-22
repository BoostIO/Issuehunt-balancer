import chai from 'chai'
import app from '../../app'
import dbLib from '../dbLib'

import { Repository, getManager } from 'typeorm'
import { Balance } from '../../entity/Balance'

describe('Test a Log controller', () => {

  beforeEach(dbLib.connectDB)
  afterEach(dbLib.dropDB)

  it('register a log', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 100
      })
      .then(function (res) {
        expect(res.status).toEqual(200)
        expect(JSON.parse(res.text)['balances']).toEqual(
          [
            { 'amount': 0, 'id': 1, 'uniqueName': '11:111' }, { 'amount': 300, 'id': 2, 'uniqueName': '22:222' }
          ]
        )
        expect(JSON.parse(res.text)['sender']).toEqual('11:111')
        expect(JSON.parse(res.text)['receiver']).toEqual('22:222')
        expect(JSON.parse(res.text)['id']).toEqual(1)
      })
      .catch(function (err) {
        throw err
      })
  })

  it('register a log when the negative balance is triggered', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 300
      })
      .then(function (res) {
        expect(res.status).toEqual(404)
        expect(res.text).toEqual('Class Validation Fails')
      })
      .catch(function (err) {
        throw err
      })
  })

  it('register a log when the decimal balance is triggered', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 1.5
      })
      .then(function (res) {
        expect(res.status).toEqual(404)
        expect(res.text).toEqual('Class Validation Fails')
      })
      .catch(function (err) {
        throw err
      })
  })

  it('find all logs', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 10
      })

    await chai.request(app)
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 20
      })

    await chai.request(app)
      .get('/logs')
      .then((res) => {
        expect(res.status).toEqual(200)
        expect(JSON.parse(res.text)[0]['id']).toEqual(1)
        expect(JSON.parse(res.text)[0]['sender']).toEqual('11:111')
        expect(JSON.parse(res.text)[0]['receiver']).toEqual('22:222')
        expect(JSON.parse(res.text)[1]['id']).toEqual(2)
        expect(JSON.parse(res.text)[1]['sender']).toEqual('11:111')
        expect(JSON.parse(res.text)[1]['receiver']).toEqual('22:222')
      })
  })

  it('find logs of a sender by uniqueName', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 10
      })

    await chai.request(app)
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 20
      })

    await chai.request(app)
      .get('/logs/sender/11:111')
      .then((res) => {
        expect(res.status).toEqual(200)
        expect(JSON.parse(res.text)[0]['sender']).toEqual('11:111')
        expect(JSON.parse(res.text)[1]['sender']).toEqual('11:111')
      })
  })

  it('find logs of a receiver by uniqueName', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 10
      })

    await chai.request(app)
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 20
      })

    await chai.request(app)
      .get('/logs/sender/11:111')
      .then((res) => {
        expect(res.status).toEqual(200)
        expect(JSON.parse(res.text)[0]['receiver']).toEqual('22:222')
        expect(JSON.parse(res.text)[1]['receiver']).toEqual('22:222')
      })
  })
})
