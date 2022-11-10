//publisher subscriber data stream implementation
//distributed network will work by having publishers to specific channels
//publishers will send information through the network
//subscribers will receive broadcasted blockchains then decide what to do with them
//every user is both a subscriber and a publisher

const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool, wallet, redisURL }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

        this.publisher = redis.createClient(redisURL);
        this.subscriber = redis.createClient(redisURL);

        this.subscribeToChannels();

        this.subscriber.on('message', (channel, message) => {
            this.handleMessage(channel, message);
        });
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

        const parsedMessage = JSON.parse(message);

        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                            chain: parsedMessage
                    });
                });
                break;
            case CHANNELS.TRANSACTION:
                if (!this.transactionPool.existingTransaction({inputAddress: this.wallet.publicKey})) {
                    this.transactionPool.setTransaction(parsedMessage);
                }
                break;
            default:
                return;
        }

    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish( {channel, message} ) {
        //preventing redundancy by not displaying to self messages you cast
        this.subscriber.unsubscribe(channel, ()=>{
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        })

        
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;