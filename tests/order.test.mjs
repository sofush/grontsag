import { expect, describe, it, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import { addToCart, beforeAll as beforeAllImpl, afterAll as afterAllImpl, app, products, createNewUser } from './common.mjs';
import { validate as uuidValidate } from 'uuid';

let jwt;
let userId;

beforeAll(async () => {
    await beforeAllImpl();
    const user = await createNewUser();
    jwt = user.jwt;
    userId = user.id;
});

afterAll(afterAllImpl);

describe('GET /api/order/new', () => {
    it('should fail when no jwt is present', async () => {
        request(app.server)
            .get('/api/cart/new')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);
    });

    it('should fail when the cart is empty', async () => {
        request(app.server)
            .get('/api/cart/new')
            .set('Accept', 'application/json')
            .set('Authorization', jwt)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);
    });

    it('should return an order when cart is not empty and jwt is present', async () => {
        await addToCart(products[0].id, 5, jwt);

        const res = await request(app.server)
            .get('/api/order/new')
            .set('Accept', 'application/json')
            .set('Authorization', jwt)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(uuidValidate(res.body.id)).toBeTruthy();
        expect(uuidValidate(res.body.userId)).toBeTruthy();
        expect(Array.isArray(res.body.products)).toBeTruthy();
        expect(res.body.status).toBe('ordered');

        res.body.products.forEach(p => {
            expect(uuidValidate(p.id)).toBeTruthy();
            expect(Number.isInteger(p.amount)).toBeTruthy();
        });
    });
});
