import mongoose from 'mongoose';

const cartedProductSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    amount: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: { type: [cartedProductSchema], required: true },
});

export default mongoose.model('Cart', cartSchema);
