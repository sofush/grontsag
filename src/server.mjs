import express from 'express';
import productRoute from './routes/productRoute.mjs';
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

        this.app.use(productRoute);
        // Array.of(productRoute, cartRoute)
        //     .forEach(this.app.use);

        this.app.use('/', (_req, res) => {
            res.sendFile('index.html', { root: 'dist' });
        });
    }
}

export default Server;