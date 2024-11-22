import express from 'express';
import Joi from 'joi';
import ProductController from '../controllers/productController.mjs';

const router = express.Router();
const productController = new ProductController();
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

router.use(express.json());

const validateQuery = (req, res, next) => {
    const { error } = requestValidator.validate(req.query);

    if (error) {
        console.error(error);
        return res.status(400).json({ error: 'Input is invalid.' });
    }

    next();
};

router.get('/products', validateQuery, async (req, res) => {
    const { idx, limit } = req.query;

    const products = await productController.readProducts(
        idx ?? 0,
        limit ?? Number.MAX_SAFE_INTEGER,
    );

    res.status(200).json(products);
});

export default router;