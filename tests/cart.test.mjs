import { expect, describe, it, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import { addToCart, beforeAll as beforeAllImpl, afterAll as afterAllImpl, app, products, createNewUser } from './common.mjs';

let jwt;
let userId;

beforeAll(async () => {
    await beforeAllImpl();
    const user = await createNewUser();
    jwt = user.jwt;
    userId = user.id;
});

afterAll(afterAllImpl);

describe('GET /api/cart', () => {
    it('should return an empty list when no products have been added', async () => {
        const res = await request(app.server)
            .get('/api/cart')
            .set('Accept', 'application/json')
            .set('Authorization', jwt)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(res.body.userId).toEqual(userId);
        expect(res.body.products).toEqual([]);
    });
});

describe('DELETE /api/cart', () => {
    it('should be able to clear the cart', async () => {
        return request(app.server)
            .delete('/api/cart')
            .set('Accept', 'application/json')
            .set('Authorization', jwt)
            .expect(200);
    });
});

describe('POST /api/cart/add', () => {
    it('should be able to add products to the cart', async () => {
        let res = await addToCart(products[0].id, 5, jwt);
        expect(res.body.userId).toEqual(userId);
        expect(res.body.products[0].productId).toEqual(products[0].id);
        expect(res.body.products[0].amount).toEqual(5);

        res = await addToCart(products[0].id, 5, jwt);
        expect(res.body.userId).toEqual(userId);
        expect(res.body.products[0].productId).toEqual(products[0].id);
        expect(res.body.products[0].amount).toEqual(10);

        res = await addToCart(products[1].id, 5, jwt);
        expect(res.body.userId).toEqual(userId);
        expect(res.body.products[0].productId).toEqual(products[0].id);
        expect(res.body.products[0].amount).toEqual(10);
        expect(res.body.products[1].productId).toEqual(products[1].id);
        expect(res.body.products[1].amount).toEqual(5);
    });
});
