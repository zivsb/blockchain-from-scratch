const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain/blockchain');
const PubSub = require('./app/pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


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

    //broadcasting the local chain for others to authorize
    pubsub.broadcastChain();

    //sends the user back to view the chain data
    res.redirect('/api/blocks');
});

const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()* 1000);
}

//TODO: research ports
//just using default reccomended 3000 for time being
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    //preventing a redundant call from the rootnode to sync to itself
    if (PORT !== DEFAULT_PORT) {
        syncChains();
    }
});

//
