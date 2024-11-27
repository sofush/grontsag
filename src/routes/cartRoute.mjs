import express from 'express';
import Joi from 'joi';
import CartController from "../controllers/cartController.mjs";
import { handleInvalidCredentials, verifyJwt } from '../util/auth.mjs';

const cartedProductValidator = Joi.object({
    productId: Joi
        .string()
        .required()
        .min(1),

    amount: Joi
        .number()
        .required()
        .integer()
        .min(1),
});

class CartRoute {
    constructor() {
        this.cartController = new CartController();
    }

    setupRouter() {
        const router = new express.Router();

        router.get('/api/cart', async (req, res) => {
            const user = verifyJwt(req.headers.authorization);

            if (!user)
                return handleInvalidCredentials(req, res);

            const cart = await this.cartController.readCart(user.id);
            res.status(200).json(cart);
        });

        router.post('/api/cart/add', async (req, res) => {
            const user = verifyJwt(req.headers.authorization);

            if (!user)
                return handleInvalidCredentials(req, res);

            const { error, value: { productId, amount }} =
                cartedProductValidator.validate(req.body);

            if (error) {
                res.status(400).json({ error: 'Invalid input' });
                return;
            }

            const updatedCart =
                await this.cartController.updateProduct(user.id, productId, amount);

            res.status(200).json(updatedCart);
        });

        router.delete('/api/cart', async (req, res) => {
            const user = verifyJwt(req.headers.authorization);

            if (!user)
                return handleInvalidCredentials(req, res);

            await this.cartController.deleteCart(user.id);
            res.status(200).end();
        });

        return router;
    }
}

export default CartRoute;
