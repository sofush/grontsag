import express from 'express';
import Joi from 'joi';
import ProductController from '../controllers/productController.mjs';

const requestValidator = Joi.object({
    idx: Joi
        .number()
        .integer()
        .min(0),

    limit: Joi
        .number()
        .integer()
        .min(1),
});

const validateQuery = (req, res, next) => {
    const { error } = requestValidator.validate(req.query);

    if (error) {
        console.error(error);
        return res.status(400).json({ error: 'Input is invalid.' });
    }

    next();
};

class ProductRoute {
    constructor() {
        this.productController = new ProductController();
    }

    setupRouter() {
        const router = express.Router();

        router.use(express.json());

        router.get('/api/products', validateQuery, async (req, res) => {
            const { idx, limit } = req.query;

            const products = await this.productController.readProducts(
                idx,
                limit,
            );

            res.status(200).json(products);
        });
        
        return router;
    }
}

export default ProductRoute;