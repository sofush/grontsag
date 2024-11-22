import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    uuid: String,
    name: String,
    description: String,
    price: Number,
    unit: String,
    image: String,
});

export default mongoose.model('Product', productSchema);