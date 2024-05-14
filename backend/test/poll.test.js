const supertest = require('supertest');
const app = require('../app'); 

describe('Poll Endpoints', () => {
    let agent = supertest.agent(app);
    let createdPollId;

    let sessionCookie;
    beforeAll(async () => {
      const res = await agent
        .post('/auth/login')
        .send({
          username: 'abbytran',
          password: 'password'
        });
    });
      
  
    //Test POST 
    it('should create a new poll', async () => {
      const newPoll = {
        user_id: 5,
        title: "This is a new poll",
        options: ["Option 1", "Option 2"],
        tags: ["funny", "animal"]
      };
  
      const response = await agent
        .post('/polls')
        .send(newPoll)
        .expect(201);

      expect(response.body).toHaveProperty('poll_id');
      expect(response.body.title).toEqual(newPoll.title);
      expect(response.body.options).toEqual(expect.arrayContaining(newPoll.options));
      expect(response.body.tags).toEqual(expect.arrayContaining(newPoll.tags));
  
      createdPollId = response.body.poll_id;
    });
  
    // Test GET 
    it('should get a poll by id', async () => {
      const response = await agent
        .get(`/polls/${createdPollId}`)
        .expect(200)
  
      expect(response.body).toHaveProperty('poll_id', createdPollId);
      expect(response.body.title).toEqual("This is a new poll");

      const optionTexts = response.body.options.map(option => option.option_text);
      expect(optionTexts).toContain("Option 1");
      expect(optionTexts).toContain("Option 2");

      const tagNames = response.body.tags.map(tag => tag.tag_name);
      expect(tagNames).toContain("funny");
      expect(tagNames).toContain("animal");
  
    });
  
    // Test DELETE /polls/:pollId to delete a poll
    it('should delete the poll', async () => {
      await agent
        .delete(`/polls/${createdPollId}`)
        .expect(200);

      await supertest(app)
        .get(`/polls/${createdPollId}`)
        .expect(404);
    });
});