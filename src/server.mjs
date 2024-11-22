import express from 'express';
import productRoute from './routes/productRoute.mjs';
import morgan from 'morgan';

class Server {
    constructor(port) {
        this.port = port;
        this.app = express();
        this.server = null;
    }

    createRoutes() {
        this.app.use(morgan('combined'));

        this.app.use('/dist', express.static('dist'));

        this.app.use(productRoute);

        this.app.use('/', (_req, res) => {
            res.sendFile('index.html', { root: 'dist' });
        });
    }

    startServer() {
        if (!!this.server)
            return;

        this.createRoutes();

        this.server = this.app.listen(this.port, () => {
            console.log(`Listening on http://localhost:${this.port}`);
        });
    }

    closeServer() {
        if (!this.server)
            return;

        this.server.close();
    }
}

export default Server;