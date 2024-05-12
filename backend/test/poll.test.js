const request = require('supertest');
const app = require('../app'); 

describe('Poll Endpoints', () => {
    let agent = request.agent(app);
    let createdPollId;

    let sessionCookie;
    request(app)  
        .post('/auth/login')  
        .send({
            username: 'qmayo2', 
            password: 'password'  
        })  
        .end((err, res) => {  
            if (err) {
                return done(err);
            }
            session = res.header['poll_cookie']; 
            done();  
        });

    beforeAll(async () => {
        
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
        .set('Cookie', sessionCookie) 
        .send(newPoll)
        .expect(201);

      expect(response.body).toHaveProperty('poll_id');
      expect(response.body.title).toEqual(newPoll.title);
      expect(response.body.options).toEqual(expect.arrayContaining(newPoll.options));
      expect(response.body.tags).toEqual(expect.arrayContaining(newPoll.tags));
  
      createdPollId = response.body.poll_id;
    });
  
    // // Test GET 
    // it('should get a poll by id', async () => {
    //   const response = await agent
    //     .get(`/polls/${createdPollId}`)
    //     .expect(200)
  
    //   expect(response.body).toHaveProperty('poll_id', createdPollId);
    //   expect(response.body.title).toEqual("This is a new poll");

    //   expect(response.body.options).toEqual([
    //     { option_text: "Option 1" }, 
    //     { option_text: "Option 2" }
    //   ]);
  
    //   expect(response.body.tags).toEqual([
    //     { tag_name: "funny" },   
    //     { tag_name: "animal" }
    //   ]);
    // });
  
    // // Test DELETE /polls/:pollId to delete a poll
    // it('should delete the poll', async () => {
    //   await agent
    //     .delete(`/polls/${createdPollId}`)
    //     .expect(200);

    //   await supertest(app)
    //     .get(`/polls/${createdPollId}`)
    //     .expect(404);
    // });
});