import Server from './server.mjs';
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/grontsag');

const app = new Server(3000);
app.startServer();

export default app;