import express from 'express';
import productRoute from './routes/productRoute.mjs';

const port = 3000;
const app = express();
const distFolder = 'dist';

app.use('/dist', express.static(distFolder));

app.use(productRoute);

app.use('/', (_req, res) => {
    console.log('index');
    res.sendFile('index.html', { root: distFolder });
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});