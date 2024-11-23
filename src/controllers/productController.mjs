import Product from '../models/product.mjs';

export default class ProductController {
    async readProducts(idx, limit) {
        return await Product
            .find({}, '-_id -__v')
            .skip(idx)
            .limit(Math.max(limit, 1));
    }
}
