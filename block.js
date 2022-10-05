const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    
    // Basic information for a Block:
    //      Timestamp of when it was created
    //      The hash of the block before
    //      Some arbitrary data
    //      The blocks own unique hash
    
    //Wrapping the parameters in curly braces specifies object notation
    //Allows me to not have to memorize the order when calling this
    
    
    constructor( {timestamp, lastHash, hash, data} ) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis() {
        return new this( GENESIS_DATA );
    }

    //use notation 'mine' instead of 'create'
    //emphasizes that computing power is required to create a new block
    static mineBlock( {lastBlock, data }) {
        // saving the timestamp at the time of calling
        // consistent timestamp throughout running of function
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;

        
        return new this({
            timestamp,
            lastHash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        });
    }

}



// node.js syntax to share code between files
module.exports = Block;