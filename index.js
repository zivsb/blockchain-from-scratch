const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain/blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/wallet');
const { response, application } = require('express');
const TransactionMiner = require('./app/transaction-miner');

const isDevelopment = process.ENV === 'development';

const REDIS_URL = isDevelopment ?
    'redis://127.0.0.1:6379' :
    'redis://:pca2b42f6a8e0e178821bccf798eace73c05184fe8b555006469f454993479fef@ec2-44-210-199-150.compute-1.amazonaws.com:7009';
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet, redisURL: REDIS_URL });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub});





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

//post method for when a user wants to send currency using the applications wallet
//post body needs to require the amount to send and a recipient
app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if(transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
        }
    } catch(error) {
        return res.status(404).json({ type: 'error', message: error.message });
    }


    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'sucess', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

app.get( '/api/wallet-info' , (req, res) => {
    const address = wallet.publicKey;

    res.json({
        address,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address})
    });
});

const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction pool map on a sync with ', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()* 1000);
}

//TODO: research ports
//just using default reccomended 3000 for time being
const PORT = process.ENV.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    //preventing a redundant call from the rootnode to sync to itself
    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
});

//
