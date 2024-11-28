import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order.mjs';

export default class OrderController {
    async createOrder(userId, cart) {
        const orderProducts = cart.products
            .map(cartedProduct => {
                return {
                    id: cartedProduct.productId,
                    amount: cartedProduct.amount,
                };
            });

        return await Order.create({
            id: uuidv4(),
            userId: userId,
            products: orderProducts,
            status: 'ordered',
        });
    }

    async readOrders(userId, idx, limit) {
        return await Order
            .find({ userId: userId })
            .skip(idx ?? 0)
            .limit(Math.max(limit ?? Number.MAX_SAFE_INTEGER, 1));
    }

    async updateOrder(order) {
        if (!order || !order.id)
            throw 'Order argument must have field `id`';

        return await Order.findOneAndUpdate(
            { id: order.id },
            order,
            { new: true }
        );
    }
}
