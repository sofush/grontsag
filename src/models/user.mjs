import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: false, default: null },
    password: { type: String, required: false, default: null },
});

export default mongoose.model('User', userSchema);
