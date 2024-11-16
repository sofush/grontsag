import express from 'express';

const port = 3000;
const app = express();

app.use('/', (_req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});