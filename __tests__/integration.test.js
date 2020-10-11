import request from 'supertest';
import app from '../src/index';
import Zombie from '../src/models/zombie';

let zombieId;

describe("Testing the Zombie API", () => {

	beforeAll((done) => { //Before tests we empty the database
      Zombie.deleteMany({}, (err) => {
         done();
      });
  });

	afterAll((done) => { //After test we clean up the database
      Zombie.deleteMany({}, (err) => {
         done();
      });
  });

	it("should return the empty list", async () => {
		const response = await request(app).get('/api/zombies');
		expect(response.status).toBe(200);
		expect(response.body.count).toBeGreaterThanOrEqual(0);
	});

  it("should be able to create a zombie", async () => {
		const response = await request(app)
    .post('/api/zombies')
    .send({
        name: 'zombie-01'
    })

    zombieId = response.body.data._id

		expect(response.status).toBe(201);
		expect(response.body.message).toBe('Zombie was created');
    expect(response.body.data).toMatchObject({name: 'zombie-01'})
	});

	it("should return the list containing one zombie", async () => {
		const response = await request(app).get('/api/zombies');
		expect(response.status).toBe(200);
		expect(response.body.count).toEqual(1);
		expect(response.body.data).toMatchObject([{name: 'zombie-01'}]);
	});

  it("should not be able to create a zombie without a name", async () => {
		const response = await request(app)
    .post('/api/zombies')
    .send({
        items: [1,2,3]
    })

		expect(response.status).toBe(400);
		expect(response.body.validationError).toBe('name is required');
	});

  it("should be able to get a zombie by id", async () => {
		const response = await request(app)
    .get(`/api/zombies/${zombieId}`)

		expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({name: 'zombie-01'})
	});

  it("should be able to update a zombie", async () => {
		const response = await request(app)
    .patch(`/api/zombies/${zombieId}`)
    .send({
        name: 'zombie-02',
        items: [1,2,3]
    })

		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Zombie was updated');
    expect(response.body.data).toMatchObject({name: 'zombie-02', items: [1,2,3]})
	});

  it("should be able to delete a zombie", async () => {
		const response = await request(app)
    .delete(`/api/zombies/${zombieId}`)

		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Zombie was removed');
	});

});
