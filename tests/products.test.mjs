import { jest, test, expect } from '@jest/globals';

jest.setTimeout(60_000);

const expected = [
  {
    'uuid': 'c5cfedb2-cde8-4613-af26-80b30ca030d6',
    'name': 'Almindelig tomat',
    'description': 'En almindelig tomat',
    'price': 2.75,
    'unit': 'stk',
    'image': '/dist/img/almindelig_tomat.png',
  },
  {
    "uuid": "766b14b9-c419-42fe-8a5f-d324f607ad96",
    "name": "Gulerødder (1 kg)",
    "description": "Et kilo gulerødder",
    "price": 14.95,
    "unit": "pose",
    "image": "/dist/img/gulerodder_1kg.png",
  },
];

test('read one product from /products?idx=0&limit=1', async () => {
  const header = await fetch('http://localhost:3000/products?idx=0&limit=1');
  expect(header.status).toBe(200);

  const body = await header.json();
  expect(body).toEqual([ expected[0] ]);
});

test('read one product from /products?idx=1', async () => {
  const header = await fetch('http://localhost:3000/products?idx=1');
  expect(header.status).toBe(200);

  const body = await header.json();
  expect(body).toEqual([ expected[1] ]);
});

test('read two products from /products?idx=0&limit=2', async () => {
  const header = await fetch('http://localhost:3000/products?idx=0&limit=2');
  expect(header.status).toBe(200);

  const body = await header.json();
  expect(body).toEqual(expected);
});

test('fail to read product from /products?idx=-1&limit=-1', async () => {
  const header = await fetch('http://localhost:3000/products?idx=-1&limit=-1');
  expect(header.ok).toBe(false);
});

test('read no products from /products?idx=999999999&limit=999999999', async () => {
  const header = await fetch('http://localhost:3000/products?idx=999999999&limit=999999999');
  expect(header.status).toBe(200);

  const body = await header.json();
  expect(body).toEqual([]);
});
