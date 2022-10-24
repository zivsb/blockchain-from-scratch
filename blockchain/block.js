const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');

class Block {
    
    // Basic information for a Block:
    //      Timestamp of when it was created
    //      The hash of the block before
    //      Some arbitrary data
    //      The blocks own unique hash
    
    //Wrapping the parameters in curly braces specifies object notation
    //Allows me to not have to memorize the order when calling this
    
    
    constructor( {timestamp, lastHash, hash, data, nonce, difficulty} ) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new this( GENESIS_DATA );
    }

    //use notation 'mine' instead of 'create'
    //emphasizes that computing power is required to create a new block
    static mineBlock( {lastBlock, data}) {
        // saving the timestamp at the time of calling
        // consistent timestamp throughout running of function
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;


        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        
        return new this({timestamp, lastHash, data, nonce, difficulty, hash});
    }

    static adjustDifficulty( { originalBlock, timestamp }) {
        const { difficulty } = originalBlock;

        if (difficulty < 1) return 1;

        const difference = timestamp - originalBlock.timestamp;

        if ( difference > MINE_RATE) return difficulty -1;

        return difficulty + 1;
    }

}



// node.js syntax to share code between files
module.exports = Block;