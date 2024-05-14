const supertest = require('supertest');
const app = require('../app'); 
const request = supertest(app);

describe('Authentication Endpoints', () => {
    let agent = supertest.agent(app);

    beforeAll(async () => {
        // Simulate login
        await agent
          .post('/auth/login')
          .send({ username: 'abbytran', password: 'password' })
          .expect(200); 
      });

    it('POST /login should handle successful login', async () => {
      const response = await request
        .post('/auth/login')
        .send({ username: 'abbytran', password: 'password' });
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Logged in successfully');
    });
  
    it('POST /login should reject incorrect login', async () => {
      const response = await request
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });
      expect(response.statusCode).toBe(401);
      expect(response.text).toContain('Username or password incorrect');
    });
  
    it('POST /logout should handle successful logout', async () => {
      const response = await agent
        .post('/auth/logout');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Logged out successfully');
    });
  
    //Have to change the user name and email before running the test again
    it('POST /signup should handle new user creation', async () => {
      const response = await request
        .post('/signup')
        .send({ username: 'nhan4', pass: 'newpass123', fname: 'test', lname: 'user', email: 'nhan4@example.com' });
      expect(response.statusCode).toBe(201);
      expect(response.text).toContain('User created successfully');
    });
  });