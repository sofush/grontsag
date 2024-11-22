import mongoose from 'mongoose';

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/grontsag');
}

const productSchema = new mongoose.Schema({
    uuid: String,
    name: String,
    description: String,
    price: Number,
    unit: String,
    image: String,
});

export default mongoose.model('Product', productSchema);