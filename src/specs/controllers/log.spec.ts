import chai from 'chai'
import app from '../../app'
import dbLib from '../dbLib'

import { Repository, getManager } from 'typeorm'
import { Balance } from '../../entity/Balance'

describe('Log controller', () => {

  beforeAll(dbLib.connectDB)
  afterEach(dbLib.initializeEntityID)

  it('delete a balance', async () => {
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

    const log = await chai.request(app)
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 100
      })

    const result = await chai.request(app)
      .post(`/logs/delete/${JSON.parse(log.text).id}`)

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)).toEqual(true)
  })

  it('registers a log', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 100
      })

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)).toMatchObject(
      { sender: '11:111',
        receiver: '22:222',
        balances:
        [ { id: 1, uniqueName: '11:111', amount: 0 },
           { id: 2, uniqueName: '22:222', amount: 300 } ],
        id: 1 }
    )
  })

  it('throw error when the negative balance is triggered', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 300
      })

    expect(result.status).toEqual(422)
    expect(JSON.parse(result.text))
      .toEqual({
        'message': 'Class Validation Fails', 'name': 'ValidationError', 'status': 422
      })

  })

  it('throw error when the decimal balance is triggered', async () => {
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
      .post('/logs/transfer')
      .send({
        sender: '11:111',
        receiver: '22:222',
        amount: 1.5
      })

    expect(result.status).toEqual(422)
    expect(JSON.parse(result.text))
      .toEqual({
        'message': 'Class Validation Fails', 'name': 'ValidationError', 'status': 422
      })

  })

  it('finds all logs', async () => {
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

    const result = await chai.request(app)
      .get('/logs')

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)[0])
      .toMatchObject({
        id: 1,
        sender: '11:111',
        receiver: '22:222'
      })
    expect(JSON.parse(result.text)[1])
      .toMatchObject({
        id: 2,
        sender: '11:111',
        receiver: '22:222'
      })

  })

  it('finds logs of a sender by uniqueName', async () => {
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

    const result = await chai.request(app)
      .get('/logs/sender/11:111')

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)[0]).toMatchObject(
      { id: 1,
        sender: '11:111',
        receiver: '22:222' }
    )
    expect(JSON.parse(result.text)[1]).toMatchObject(
      { id: 2,
        sender: '11:111',
        receiver: '22:222' }
    )

  })

  it('finds logs of a receiver by uniqueName', async () => {
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

    const result = await chai.request(app)
      .get('/logs/sender/11:111')

    expect(result.status).toEqual(200)
    expect(JSON.parse(result.text)[0]).toMatchObject(
      { id: 1,
        sender: '11:111',
        receiver: '22:222' }
    )
    expect(JSON.parse(result.text)[1]).toMatchObject(
      { id: 2,
        sender: '11:111',
        receiver: '22:222' }
    )

  })
})
