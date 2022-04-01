const db = require('../data/dbConfig')
const server = require('./server')
const request = require('supertest')
const bcrypt = require('bcryptjs')


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('users').truncate();
});
afterAll(async () => {
  await db.destroy();
});

test('sanity', () => {
  expect(true).toBe(true)
})

describe('[GET] /api/auth/users', () => {
  test('[1] requests without a token are bounced back with proper status and message', async () => {
    const res = await request(server).get('/api/auth/users')
    expect(res.body.message).toMatch(/token required/i)
  })
  test('[2] requests with a invalid token are bounced back with proper status and message', async () => {
    const res = await request(server).get('/api/auth/users').set('Authorization', 'foobar')
    expect(res.body.message).toMatch(/token invalid/i)
  })
}, 750)

describe('[POST] /api/auth/register', () => {
  test('[1] creates a new user in the database', async () => {
    await request(server).post('/api/auth/register').send({username: 'sue', password:'1234'})
    const sue = await db('users').where('username', 'sue').first()
    expect(sue).toMatchObject({ username: 'sue' })
  })
  test('[2] new user passwords are saved correctly bcrypted', async () => {
    await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
    const sue = await db('users').where('username', 'sue').first()
    expect(bcrypt.compareSync('1234', sue.password)).toBeTruthy()
  })
}, 750)

describe('[POST] /api/auth/login', () => {
    test('[1] responds with the correct message on valid credentials', async () => {
      const res = await request(server).post('/api/auth/login').send({username: 'bobby' , password: '1234'})
      expect(res.body.message).toMatch(/Welcome crystal/i)
    })
    test('[2] responds with correct message invalid credentials', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
      expect(res.body.message).toMatch(/invalid credentials/i)
      expect(res.status).toBe(401)
    })
}, 750)
