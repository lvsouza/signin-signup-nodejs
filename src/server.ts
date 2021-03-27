import express from "express";

const app = express();

app.get('/teste', (req, res) => {

    return res.send('Chegou aqui!')
});

app.listen(3333);
