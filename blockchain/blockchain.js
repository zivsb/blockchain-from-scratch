const Block = require('./block');
const { cryptoHash } = require('../util/util');

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

    //  TODO: Create and isValidChain() function that passes the tests
    static isValidChain(chain) {

        // JSON.stringify allows use just to check that the keys and values of each are the same
        // bypassing the tripple equals nuances
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const expectedLH = chain[i-1].hash;
            const { timestamp, lastHash, hash, nonce, difficulty, data } = block;
            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== expectedLH) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if (hash !== validatedHash) return false;

            if ((lastDifficulty - difficulty) > 1) return false;

        }

        return true;
    }

    replaceChain(chain, onSuccess) { 

        if (chain.length <= this.chain.length){
            console.error('The incoming chain must be longer');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        if(onSuccess) onSuccess();
        console.log('replacing chain with', chain);        
        this.chain = chain;

    }

}

module.exports = Blockchain;