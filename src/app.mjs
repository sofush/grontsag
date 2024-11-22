import Server from './server.mjs';

const app = new Server(3000);
app.startServer();

export default app;