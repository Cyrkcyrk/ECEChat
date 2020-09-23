
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

describe('messages', () => {
  
  beforeEach( async () => {
    await db.admin.clear()
  })
  
  it('list empty', async () => {
    const {body: messages} = await supertest(app)
    .get('/messages')
    .expect(200)
    messages.should.match([])
  })
  
  it('list one message', async () => {
    await supertest(app)
    .post('/message')
    .send({content: 'Hello ECE'})
    // Get messages
    const {body: messages} = await supertest(app)
    .get('/messages')
    .expect(200)
    messages.should.match([{
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      content: 'Hello ECE'
    }])
  })
  
  it('add one element', async () => {
	await db.admin.clear()
    // Create a message
    await supertest(app)
    .post('/message')
    .send({content: 'message 1'})
    // Create a message inside it
    const {body: message} = await supertest(app)
    .post('/message')
    .send({content: 'Hello ECE'})
    .expect(201)
    message.should.match({
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      content: 'Hello ECE'
    })
    // Check it was correctly inserted
    const {body: messages} = await supertest(app)
    .get('/messages')
    messages.length.should.eql(2)
  })
  
})
