import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse: true, default: undefined },
    password: { type: String, required: false, default: undefined },
});

export default mongoose.model('User', userSchema);
