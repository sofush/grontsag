import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: Number, required: true },
    image: { type: Number, required: true },
});

export default mongoose.model('Product', productSchema);