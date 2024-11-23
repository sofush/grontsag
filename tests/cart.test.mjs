import { expect, describe, it, afterAll, beforeAll } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';
import Server from '../src/server.mjs';
import Product from '../src/models/product.mjs';

let app;
let db;
let jwt;
let userId;

const products = [
    {
        "uuid": "c5cfedb2-cde8-4613-af26-80b30ca030d6",
        "name": "Almindelig tomat",
        "description": "En almindelig tomat",
        "price": 2.75,
        "unit": "stk",
        "image": "/dist/img/almindelig_tomat.png"
    },
    {
        "uuid": "766b14b9-c419-42fe-8a5f-d324f607ad96",
        "name": "Gulerødder (1 kg)",
        "description": "Et kilo gulerødder",
        "price": 14.95,
        "unit": "pose",
        "image": "/dist/img/gulerodder_1kg.png"
    }
];

const addToCart = (productId, amount) => {
    return request(app.server)
        .post('/api/cart/add')
        .set('Accept', 'application/json')
        .set('Authorization', jwt)
        .send({ productId: productId, amount: amount })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
};

beforeAll(async () => {
    db = await MongoMemoryServer.create();
    await mongoose.connect(db.getUri());
    await Product.create(products);

    app = new Server(0);
    app.start();

    const res = await request(app.server)
        .get('/api/user/new')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

    expect(res.body.jwt).toMatch(/^(?:[\w-]+\.){2}[\w-]+$/);
    jwt = res.body.jwt;

    const userRes = await request(app.server)
        .get('/api/user')
        .set('Accept', 'application/json')
        .set('Authorization', jwt)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

    userId = userRes.body.id;
});

afterAll(async () => {
    await mongoose.connection.close();
    await db.stop();
    app.close();
});

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
        let res = await addToCart(products[0].uuid, 5);
        expect(res.body.userId).toEqual(userId);
        expect(res.body.products[0].productId).toEqual(products[0].uuid);
        expect(res.body.products[0].amount).toEqual(5);

        res = await addToCart(products[0].uuid, 5);
        expect(res.body.userId).toEqual(userId);
        expect(res.body.products[0].productId).toEqual(products[0].uuid);
        expect(res.body.products[0].amount).toEqual(10);

        res = await addToCart(products[1].uuid, 5);
        expect(res.body.userId).toEqual(userId);
        expect(res.body.products[0].productId).toEqual(products[0].uuid);
        expect(res.body.products[0].amount).toEqual(10);
        expect(res.body.products[1].productId).toEqual(products[1].uuid);
        expect(res.body.products[1].amount).toEqual(5);
    });
});
