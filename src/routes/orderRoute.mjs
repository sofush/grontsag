import express from 'express';
import Joi from 'joi';
import stripe from 'stripe';
import OrderController from "../controllers/orderController.mjs";
import CartController from "../controllers/cartController.mjs";
import ProductController from "../controllers/productController.mjs";
import { handleInvalidCredentials, verifyJwt } from '../util/auth.mjs';

const s = stripe(process.env.STRIPE_SECRET_KEY);
const requestValidator = Joi.object({
    orderId: Joi
        .string()
        .required()
        .min(1),
});

class OrderRoute {
    constructor() {
        this.orderController = new OrderController();
        this.cartController = new CartController();
        this.productController = new ProductController();
    }

    setupRouter() {
        const router = new express.Router();

        router.get('/api/orders', async (req, res) => {
            const user = verifyJwt(req.headers.authorization);

            if (!user)
                return handleInvalidCredentials(req, res);

            const orders = await this.orderController.readOrders(user.id);
            return res.status(200).json(orders);
        });

        router.get('/api/order/new', async (req, res) => {
            const user = verifyJwt(req.headers.authorization);

            if (!user)
                return handleInvalidCredentials(req, res);

            const cart = await this.cartController.readCart(user.id);
            const order = await this.orderController.createOrder(user.id, cart);

            // await this.cartController.deleteCart(user.id);
            res.status(200).json(order);
            return;
        });

        router.post('/api/order/pay', async (req, res) => {
            const user = verifyJwt(req.headers.authorization);

            if (!user)
                return handleInvalidCredentials(req, res);

            const { error, value: request } = requestValidator.validate(req.body);

            if (error) {
                res.status(400).json({ error: 'Invalid input' });
                return;
            }

            const products = await this.productController.readProducts();
            const orders = await this.orderController.readOrders(user.id);
            const order = orders.find(o => o.id === request.orderId);
            const lineItems = order.products
                .map(cartedProduct => {
                    const product = products.find(p => cartedProduct.id === p.id);

                    console.log(cartedProduct);
                    console.log(product);

                    if (!product) {
                        console.error(`Could not find product by id ${product.id}`);
                        return;
                    }

                    return {
                        price_data: {
                            currency: 'dkk',
                            product_data: {
                                name: product.name,
                                description: product.description,
                            },
                            unit_amount: Math.trunc(product.price * 100),
                        },
                        quantity: cartedProduct.amount,
                    };
                })
                .filter(e => !!e);

            const session = await s.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `http://localhost:3000/api/order/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: 'http://localhost:3000/orders',
                metadata: {
                    order_id: order.id,
                }
            });

            res.status(200).json({ url: session.url });
        });

        router.get('/api/order/success', async (req, res) => {
            const sessionId = req.query.session_id;

            if (!sessionId) {
                return res.status(400).send('Missing session ID');
            }

            try {
                const session = await s.checkout.sessions.retrieve(sessionId);
                const orderId = session.metadata.order_id;
                const order = await this.orderController.updateOrder({
                    id: orderId,
                    paidAt: new Date(),
                    status: 'paid',
                });

                if (req.accepts('html')) {
                    return res.redirect(`/success?id=${orderId}`);
                }

                res.status(200).json(order);
            } catch (error) {
                console.error(error);
                res.status(500).send('Failed to retrieve session');
            }
        });

        return router;
    }
}

export default OrderRoute;
