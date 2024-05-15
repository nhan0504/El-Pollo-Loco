const supertest = require('supertest');
const app = require('../app'); 

describe('Votes Endpoints', () => {
  let agent = supertest.agent(app);
  let createdVoteId;

  beforeAll(async () => {
    await agent
      .post('/auth/login')
      .send({ username: process.env.TESTUSER, password: process.env.TESTPASS })
      .expect(200);
  });

  it('should add a new vote', async () => {
    const voteData = {
      option_id: 88
    };

    const response = await agent
      .post('/polls/vote')
      .send(voteData)
      .expect(201);

    createdVoteId = response.body.voteId;
  });

  it('should undo a vote', async () => {
    await agent
      .delete(`/polls/vote/${createdVoteId}`)
      .expect(200);
  });
});