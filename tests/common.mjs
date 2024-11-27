import { expect } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';
import Product from '../src/models/product.mjs';
import Server from '../src/server.mjs';

export const products = [
    {
        "id": "c5cfedb2-cde8-4613-af26-80b30ca030d6",
        "name": "Almindelig tomat",
        "description": "En almindelig tomat",
        "price": 2.75,
        "unit": "stk",
        "image": "/dist/img/almindelig_tomat.png"
    },
    {
        "id": "766b14b9-c419-42fe-8a5f-d324f607ad96",
        "name": "Gulerødder (1 kg)",
        "description": "Et kilo gulerødder",
        "price": 14.95,
        "unit": "pose",
        "image": "/dist/img/gulerodder_1kg.png"
    },
    {
        "id": "372b0fa4-b367-494e-b87a-91f26497dc5c",
        "name": "Rødløg",
        "description": "Et rødløg",
        "price": 1.35,
        "unit": "stk",
        "image": "/dist/img/rodlog.png"
    },
    {
        "id": "b1f0f948-0fd9-4bf6-9c68-cdbcc42e9cf7",
        "name": "Avocado",
        "description": "En avocado",
        "price": 8.95,
        "unit": "stk",
        "image": "/dist/img/avocado.png"
    }
];

export let db;
export let app;

export const beforeAll = async () => {
    db = await MongoMemoryServer.create();
    await mongoose.connect(db.getUri());

    for (const idx in products) {
        const product = new Product(products[idx]);
        await product.save();
    }

    app = new Server(0);
    app.start();
};

export const afterAll = async () => {
    await mongoose.connection.close();
    await db.stop();
    app.close();
};

export const addToCart = (productId, amount, jwt) => {
    return request(app.server)
        .post('/api/cart/add')
        .set('Accept', 'application/json')
        .set('Authorization', jwt)
        .send({ productId: productId, amount: amount })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
};

export const createNewUser = async () => {
    const res = await request(app.server)
        .get('/api/user/new')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

    const jwt = res.body.jwt;
    expect(jwt).toMatch(/^(?:[\w-]+\.){2}[\w-]+$/);

    const userRes = await request(app.server)
        .get('/api/user')
        .set('Accept', 'application/json')
        .set('Authorization', jwt)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);

    return { id: userRes.body.id, jwt: jwt };
};