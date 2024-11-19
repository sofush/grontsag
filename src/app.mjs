import express from 'express';

const port = 3000;
const app = express();
const distFolder = 'dist';

app.use('/dist', express.static(distFolder));

app.use('/', (_req, res) => {
    console.log('index');
    res.sendFile('index.html', { root: distFolder });
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});