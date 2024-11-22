import { expect, describe, it, afterAll, beforeAll, jest } from '@jest/globals';
import request from 'supertest';
import Server from '../src/server.mjs';
import mongoose from 'mongoose';
import Product from '../src/models/product.mjs';
import { MongoMemoryServer } from 'mongodb-memory-server';

let app;
let db;

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

beforeAll(async () => {
  db = await MongoMemoryServer.create();
  await mongoose.connect(db.getUri());

  for (const idx in products) {
    const product = new Product(products[idx]);
    await product.save();
  }

  app = new Server(3000);
  app.startServer();
});

afterAll(async () => {
  await mongoose.connection.close();
  await db.stop();
  await app.closeServer();
});

// const products = [
//   {
//     'uuid': 'c5cfedb2-cde8-4613-af26-80b30ca030d6',
//     'name': 'Almindelig tomat',
//     'description': 'En almindelig tomat',
//     'price': 2.75,
//     'unit': 'stk',
//     'image': '/dist/img/almindelig_tomat.png',
//   },
//   {
//     "uuid": "766b14b9-c419-42fe-8a5f-d324f607ad96",
//     "name": "Gulerødder (1 kg)",
//     "description": "Et kilo gulerødder",
//     "price": 14.95,
//     "unit": "pose",
//     "image": "/dist/img/gulerodder_1kg.png",
//   },
// ];

describe('GET /products', done => {
  it('should be able to get all products', async () => {
    const res = await request(app.server)
      .get('/products')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    expect(res.body).toEqual(products);
  });

  it('should be able to get a single products', async () => {
    const res = await request(app.server)
      .get('/products?idx=1&limit=1')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    expect(res.body).toEqual([ products[1] ]);
  });

  it('should be able to read two products with a limit', async () => {
    const res = await request(app.server)
      .get('/products?idx=0&limit=2')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    expect(res.body).toEqual(products);
  });

  it('should fail to read a product with invalid index', async () => {
    return request(app.server)
      .get('/products?idx=-1&limit=1')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400);
  });

  it('should fail to read a product with invalid limit', async () => {
    return request(app.server)
      .get('/products?idx=1&limit=-1')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400);
  });

  it('should read no products at out-of-bounds index', async () => {
    const res = await request(app.server)
      .get('/products?idx=99999999&limit=1')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    expect(res.body).toEqual([]);
  });
});
