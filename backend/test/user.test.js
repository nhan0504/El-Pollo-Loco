const supertest = require('supertest');
const app = require('../app');

describe('GET /users/:id', () => {
  it('Return existing user', async () => {
    const userId = 4;
    const response = await supertest(app)
      .get(`/users/${userId}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body[0]).toEqual({
      user_id: 4,
      username: 'sara_miller',
      pass: 'saraspass',
      fname: 'Sara',
      lname: 'Miller',
      email: 'sara.miller@example.com',
      salt: null,
    });
  });

  it('Return 404 if the user does not exist', async () => {
    const userId = -1;
    await supertest(app).get(`/users/${userId}`).expect(404);
  });
});

describe('POST and DELETE', () => {
  let createdUserId;

  // Test POST
  it('should create a new user', async () => {
    const newUser = {
      username: 'test_user',
      pass: 'testpass',
      fname: 'fname',
      lname: 'lname',
      email: 'testuser@example.com',
    };

    const response = await supertest(app).post('/users').send(newUser).expect(201);

    createdUserId = response.body.user_id;
  });

  // Test DELETE
  it('should delete an existing user', async () => {
    const response = await supertest(app).delete(`/users/${createdUserId}`).expect(200);

    expect(response.text).toEqual(`User ${createdUserId} deleted successfully`);
  });
});
