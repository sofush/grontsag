import mongoose from 'mongoose';

const orderProduct = new mongoose.Schema({
    id: { type: String, required: true },
    amount: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    products: { type: [orderProduct], required: true },
    status: {
        type: String,
        enum: [ 'ordered', 'paid', 'ready', 'complete' ],
        required: true,
    },
    createdAt: { type: Date, required: true, default: Date.now },
    paidAt: { type: Date },
    readyAt: { type: Date },
    deliveredAt: { type: Date },
});

export default mongoose.model('Order', orderSchema);
