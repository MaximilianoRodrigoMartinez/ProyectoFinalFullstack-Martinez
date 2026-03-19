import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/expressApp.js';

describe('API Sessions (funcional)', () => {
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

    describe('POST /api/sessions/register', () => {
        it('crea un usuario y devuelve éxito con el id', async () => {
            const res = await request(app)
                .post('/api/sessions/register')
                .send({
                    first_name: 'Ana',
                    last_name: 'García',
                    email: 'ana@example.com',
                    password: 'password123'
                });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.exist;
        });

        it('rechaza registro con datos incompletos', async () => {
            const res = await request(app)
                .post('/api/sessions/register')
                .send({ first_name: 'Ana', email: 'ana@example.com' });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });

        it('rechaza email duplicado', async () => {
            const body = {
                first_name: 'Ana',
                last_name: 'García',
                email: 'dup@example.com',
                password: 'password123'
            };
            await request(app).post('/api/sessions/register').send(body);
            const res = await request(app).post('/api/sessions/register').send(body);

            expect(res.status).to.equal(400);
            expect(res.body.error).to.match(/already exists|exists/i);
        });
    });

    describe('POST /api/sessions/login', () => {
        const userBody = {
            first_name: 'Luis',
            last_name: 'Pérez',
            email: 'luis@example.com',
            password: 'miClaveSegura'
        };

        beforeEach(async () => {
            await request(app).post('/api/sessions/register').send(userBody);
        });

        it('inicia sesión con credenciales válidas y envía cookie', async () => {
            const res = await request(app)
                .post('/api/sessions/login')
                .send({ email: userBody.email, password: userBody.password });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.headers['set-cookie']).to.exist;
            const cookie = res.headers['set-cookie'].join(';');
            expect(cookie).to.include('coderCookie');
        });

        it('rechaza login con contraseña incorrecta', async () => {
            const res = await request(app)
                .post('/api/sessions/login')
                .send({ email: userBody.email, password: 'otraClave' });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });

        it('rechaza login si el usuario no existe', async () => {
            const res = await request(app)
                .post('/api/sessions/login')
                .send({ email: 'noexiste@example.com', password: 'x' });

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
        });

        it('rechaza login con campos incompletos', async () => {
            const res = await request(app)
                .post('/api/sessions/login')
                .send({ email: userBody.email });

            expect(res.status).to.equal(400);
        });
    });
});
