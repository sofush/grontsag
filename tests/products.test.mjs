import { expect, describe, it, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import { beforeAll as beforeAllImpl, afterAll as afterAllImpl, app, products } from './common.mjs';

beforeAll(beforeAllImpl);
afterAll(afterAllImpl);

describe('GET /api/products', () => {
    it('should be able to get all products', async () => {
        const res = await request(app.server)
            .get('/api/products')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(res.body).toEqual(products);
    });

    it('should be able to get a single products', async () => {
        const res = await request(app.server)
            .get('/api/products?idx=1&limit=1')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(res.body).toEqual([products[1]]);
    });

    it('should be able to read two products with a limit', async () => {
        const res = await request(app.server)
            .get('/api/products?idx=1&limit=2')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(res.body).toEqual([products[1], products[2]]);
    });

    it('should fail to read a product with invalid index', async () => {
        return request(app.server)
            .get('/api/products?idx=-1&limit=1')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);
    });

    it('should fail to read a product with invalid limit', async () => {
        return request(app.server)
            .get('/api/products?idx=1&limit=-1')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400);
    });

    it('should read no products at out-of-bounds index', async () => {
        const res = await request(app.server)
            .get('/api/products?idx=99999999&limit=1')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(res.body).toEqual([]);
    });
});

describe('GET /', () => {
    it('should return HTML on front page', () => {
        return request(app.server)
            .get('/')
            .expect('Content-Type', 'text/html; charset=UTF-8')
            .expect(200);
    });
});
