import express from 'express';
import productRoute from './routes/productRoute.mjs';
import morgan from 'morgan';

const port = 3000;
const app = express();
const distFolder = 'dist';

app.use(morgan('combined'));

app.use('/dist', express.static(distFolder));

app.use(productRoute);

app.use('/', (_req, res) => {
    console.log('index');
    res.sendFile('index.html', { root: distFolder });
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});