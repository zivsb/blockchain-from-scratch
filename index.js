const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

//a callback function executes whenever
//someone make an api/blocks request
//we respond with the blockchain in json form
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

//TODO: research ports
//just using default reccomended 3000 for time being
const PORT = 3000
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
});