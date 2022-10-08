const Block = require('./block');

//Basic blockchain requirements:
//  Start with the genesis block
//  Be able to add new blocks that are 'chained'
class Blockchain {

    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

}

module.exports = Blockchain;