import Cart from '../models/cart.mjs';

export default class CartController {
    async readCart(userId) {
        let cart = await Cart.findOne({ userId: userId }).lean();

        if (cart)
            return cart;

        return new Cart({
            userId: userId,
            products: [],
        }).save();
    }

    async updateProduct(userId, productId, amount, additive) {
        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            return await Cart.create({
                userId: userId,
                products: [{ productId: productId, amount: amount }]
            });
        }

        const existingProductIndex = cart.products.findIndex(p => p.productId === productId);

        if (existingProductIndex >= 0) {
            if (additive)
                cart.products[existingProductIndex].amount += amount;
            else
                cart.products[existingProductIndex].amount = amount;
        } else if (amount > 0) {
            cart.products.push({ productId: productId, amount: amount });
        }

        cart.products = cart.products.filter(p => p.amount > 0);
        return await cart.save();
    }

    async deleteCart(userId) {
        return await Cart.deleteMany({ userId: userId });
    }
}
