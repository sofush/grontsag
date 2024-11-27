import { expect, describe, it, afterAll, beforeAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { validate as uuidValidate } from 'uuid';
import { beforeAll as beforeAllImpl, afterAll as afterAllImpl, app } from './common.mjs';

const jwtRegex = /^(?:[\w-]+\.){2}[\w-]+$/;

beforeAll(beforeAllImpl);
afterAll(afterAllImpl);

describe('GET /api/user/new', () => {
    it('should return a new user when no jwt is present', async () => {
        const res = await request(app.server)
            .get('/api/user/new')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(res.body.jwt).toMatch(jwtRegex);
    });

    it('should return a new user when a jwt is present', async () => {
        const res = await request(app.server)
            .get('/api/user/new')
            .set('Accept', 'application/json')
            .set('Authorization', 'should.ignore.this')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(res.body.jwt).toMatch(jwtRegex);
    });
});

describe('GET /api/user with invalid, or no token', () => {
    it('should not succeed with an invalid token', () => {
        return request(app.server)
            .get('/api/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'not.a.valid.token')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(403);
    });
});

describe('GET /api/user with valid token', () => {
    let jwt;

    beforeEach(async () => {
        const res = await request(app.server)
            .get('/api/user/new')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(res.body.jwt).toMatch(jwtRegex);
        jwt = res.body.jwt;
    });

    it('should return an existing user when valid token is present', async () => {
        const res = await request(app.server)
            .get('/api/user')
            .set('Accept', 'application/json')
            .set('Authorization', jwt)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(uuidValidate(res.body.id)).toBeTruthy();
        expect(res.body.email).toBe(undefined);
        expect(res.body.password).toBe(undefined);
    });

    it('should update the user with a valid token', async () => {
        const email = 'email@example.org';
        const password = 'verysecurepassword123';
        const res = await request(app.server)
            .patch('/api/user')
            .set('Accept', 'application/json')
            .set('Authorization', jwt)
            .send({ email: email, password: password })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        const jwtRet = res.body.jwt;
        const userRet = res.body.user;

        expect(uuidValidate(userRet.id)).toBeTruthy();
        expect(userRet.email).toBe(email);
        expect(userRet.password).toBe(undefined);
        expect(jwtRet).toMatch(jwtRegex);
    });
});
