import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/expressApp.js';

describe('API Adoptions (funcional)', () => {
    let mongoServer;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    after(async () => {
        await mongoose.disconnect();
        if (mongoServer) await mongoServer.stop();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    async function registerUser(overrides = {}) {
        const body = {
            first_name: 'Ada',
            last_name: 'Lovelace',
            email: 'ada@example.com',
            password: 'secret123',
            ...overrides
        };
        const res = await request(app).post('/api/sessions/register').send(body);
        expect(res.status).to.equal(200);
        return { id: res.body.payload, body };
    }

    async function createPet(overrides = {}) {
        const body = {
            name: 'Firulais',
            specie: 'dog',
            birthDate: '2020-01-15',
            ...overrides
        };
        const res = await request(app).post('/api/pets').send(body);
        expect(res.status).to.equal(200);
        return { id: res.body.payload._id, raw: res.body.payload };
    }

    describe('GET /api/adoptions', () => {
        it('devuelve lista vacía cuando no hay adopciones', async () => {
            const res = await request(app).get('/api/adoptions');
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.be.an('array').that.has.length(0);
        });

        it('devuelve adopciones existentes', async () => {
            const { id: uid } = await registerUser();
            const { id: pid } = await createPet();
            await request(app).post(`/api/adoptions/${uid}/${pid}`).expect(200);

            const res = await request(app).get('/api/adoptions');
            expect(res.status).to.equal(200);
            expect(res.body.payload).to.be.an('array').that.has.length(1);
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('devuelve 404 si la adopción no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app).get(`/api/adoptions/${fakeId}`);
            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
        });

        it('devuelve la adopción por id', async () => {
            const { id: uid } = await registerUser();
            const { id: pid } = await createPet();
            await request(app).post(`/api/adoptions/${uid}/${pid}`);

            const list = await request(app).get('/api/adoptions');
            const aid = list.body.payload[0]._id;

            const res = await request(app).get(`/api/adoptions/${aid}`);
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.have.property('owner');
            expect(res.body.payload).to.have.property('pet');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('adopta con usuario y mascota válidos', async () => {
            const { id: uid } = await registerUser();
            const { id: pid } = await createPet();

            const res = await request(app).post(`/api/adoptions/${uid}/${pid}`);
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.match(/adopted/i);
        });

        it('404 si el usuario no existe', async () => {
            const { id: pid } = await createPet();
            const fakeUserId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).post(`/api/adoptions/${fakeUserId}/${pid}`);
            expect(res.status).to.equal(404);
            expect(res.body.error).to.match(/user|not found/i);
        });

        it('404 si la mascota no existe', async () => {
            const { id: uid } = await registerUser();
            const fakePetId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).post(`/api/adoptions/${uid}/${fakePetId}`);
            expect(res.status).to.equal(404);
            expect(res.body.error).to.match(/pet|not found/i);
        });

        it('400 si la mascota ya está adoptada', async () => {
            const { id: uid } = await registerUser({ email: 'owner1@example.com' });
            const { id: uid2 } = await registerUser({
                first_name: 'Bob',
                email: 'owner2@example.com'
            });
            const { id: pid } = await createPet();

            await request(app).post(`/api/adoptions/${uid}/${pid}`).expect(200);

            const res = await request(app).post(`/api/adoptions/${uid2}/${pid}`);
            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.match(/already adopted/i);
        });
    });
});
