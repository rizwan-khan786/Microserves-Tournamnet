const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app'); // Adjust path if needed

let server;
let tournamentId;

beforeAll(async () => {
  server = app.listen(0);

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (server) server.close();
});

describe('Tournament Service', () => {
  const tournamentPayload = {
    name: 'Cricket World Cup',
    location: 'India',
    startDate: '2025-10-01',
    endDate: '2025-11-01'
  };

  test('Create a new tournament', async () => {
    const res = await request(server)
      .post('/api/v1/tournaments')
      .send(tournamentPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(tournamentPayload.name);
    tournamentId = res.body.data._id;
  });

  test('Get list of tournaments', async () => {
    const res = await request(server).get('/api/v1/tournaments');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('Add player to tournament', async () => {
    const playerPayload = {
      name: 'Virat Kohli',
      role: 'Batsman',
      team: 'India'
    };
    const res = await request(server)
      .post(`/api/v1/tournaments/${tournamentId}/players`)
      .send(playerPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.players).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Virat Kohli' })])
    );
  });

  test('Add umpire to tournament', async () => {
    const umpirePayload = {
      name: 'Umpire 1',
      country: 'Australia'
    };
    const res = await request(server)
      .post(`/api/v1/tournaments/${tournamentId}/umpires`)
      .send(umpirePayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.umpires).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Umpire 1' })])
    );
  });

  test('Update tournament score table', async () => {
    const scorePayload = {
      team: 'India',
      matches: 5,
      wins: 4,
      losses: 1,
      points: 8
    };
    const res = await request(server)
      .post(`/api/v1/tournaments/${tournamentId}/scores`)
      .send(scorePayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.scores).toEqual(
      expect.arrayContaining([expect.objectContaining({ team: 'India', points: 8 })])
    );
  });

  test('Get single tournament by ID', async () => {
    const res = await request(server).get(`/api/v1/tournaments/${tournamentId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(tournamentId);
  });

  test('Delete tournament', async () => {
    const res = await request(server).delete(`/api/v1/tournaments/${tournamentId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
