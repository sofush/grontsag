import { expect, describe, it, afterAll, beforeAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';
import { validate as uuidValidate } from 'uuid';
import Server from '../src/server.mjs';

let app;
let db;

beforeAll(async () => {
  db = await MongoMemoryServer.create();
  await mongoose.connect(db.getUri());

  app = new Server(0);
  app.start();
});

afterAll(async () => {
  await mongoose.connection.close();
  await db.stop();
  app.close();
});

describe('GET /user with invalid, or no token', () => {
    it('should return a new user when no JWT is present', async () => {
        return request(app.server)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        // TODO: expect/validate content to be jwt
    });

    it('should not succeed with an invalid token', () => {
        return request(app.server)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'not.a.valid.token')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(500);
    });
});

describe('GET /user with valid token', () => {
    let jwt;

    beforeEach(async () => {
        jwt = await request(app.server)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        // TODO: expect/validate content to be jwt
    });

    it('should return an existing user when valid token is present', async () => {
        const res = await request(app.server)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', jwt)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(uuidValidate(res.uuid)).toBeTruthy();
    });

    it('should update the user with a valid token', async () => {
        const res = await request(app.server)
            .patch('/user')
            .set('Accept', 'application/json')
            .set('Authorization', jwt)
            .send({
                email: 'email@example.org',
                password: 'verysecurepassword123',
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(uuidValidate(res.uuid)).toBeTruthy();
    });
});

describe('GET /login', () => {
    it('should return HTML', () => {
        return request(app.server)
            .get('/login')
            .expect('Content-Type', 'text/html; charset=UTF-8')
            .expect(200);
    });
});

describe('GET /register', () => {
    it('should return HTML', () => {
        return request(app.server)
            .get('/register')
            .expect('Content-Type', 'text/html; charset=UTF-8')
            .expect(200);
    });
});
