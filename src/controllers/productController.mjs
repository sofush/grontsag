import Product from '../models/product.mjs';

export default class ProductController {
    async readProducts(idx, limit) {
        return await Product
            .find({}, '-_id -__v')
            .skip(idx ?? 0)
            .limit(Math.max(limit ?? Number.MAX_SAFE_INTEGER, 1));
    }
}
