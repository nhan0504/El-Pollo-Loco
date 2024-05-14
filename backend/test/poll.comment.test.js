const supertest = require('supertest');
const app = require('../app'); 

describe('Comments Endpoints', () => {
  let agent = supertest.agent(app);
  let createCommentId;

  beforeAll(async () => {
    await agent
      .post('/auth/login')
      .send({ username: process.env.TESTUSER, password: process.env.TESTPASS })
      .expect(200);
  });

  it('should create a new comment', async () => {
    const commentData = {
      poll_id: 67,  
      parent_id: null,  
      comment: 'This is a test comment'
    };

    const response = await agent
      .post('/polls/comment')
      .send(commentData)
      .expect(201);

    createCommentId = response.body.comment_id;
  });

  it('should delete a comment', async () => {
    await agent
      .delete(`/polls/comment/${createCommentId}`)
      .expect(200);
  });
});