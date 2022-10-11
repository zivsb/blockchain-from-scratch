const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

//configuring node to rely on this dependency
//bodyParser parses requests bodies as objects before the handlers
app.use(bodyParser.json());

//a callback function executes whenever
//someone make an api/blocks request
//we respond with the blockchain in json form
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

//post method is mainly for sending data to the server
//function for when a miner successfully mined a blocks and looks to add it to the chain
app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    //adding the block to the local chain
    blockchain.addBlock({ data });

    //sends the user back to view the chain data
    res.redirect('/api/blocks');
});

//TODO: research ports
//just using default reccomended 3000 for time being
const PORT = 3000
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
});

//
