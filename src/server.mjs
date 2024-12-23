import 'dotenv/config';
import express from 'express';
import ProductRoute from './routes/productRoute.mjs';
import UserRoute from './routes/userRoute.mjs';
import CartRoute from './routes/cartRoute.mjs';
import OrderRoute from './routes/orderRoute.mjs';
import morgan from 'morgan';

class Server {
    constructor(port) {
        this.port = port;
        this.app = express();
        this.server = null;
    }

    start() {
        if (!!this.server)
            return;

        this.setupRoutes();

        this.server = this.app.listen(this.port, () => {
            console.log(`Listening on http://localhost:${this.port}`);
        });
    }

    close() {
        if (!this.server)
            return;

        this.server.close();
    }

    setupRoutes() {
        this.app.use(morgan('combined'));

        this.app.use('/dist', express.static('dist'));

        [
            new ProductRoute().setupRouter(),
            new UserRoute().setupRouter(),
            new CartRoute().setupRouter(),
            new OrderRoute().setupRouter(),
        ].forEach(route => this.app.use(route));

        this.app.use('/', (_req, res) => {
            res.sendFile('index.html', { root: 'dist' });
        });
    }
}

export default Server;