const Block = require('./block');
const { cryptoHash } = require('../util/util');
const Wallet = require('../wallet/wallet');
const Transaction = require('../wallet/transaction');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

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

  validTransactionData({ chain }) {
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          if (rewardTransactionCount > 1) {
            console.error('Miner rewards exceeds limit');
            return false;
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error('Miner reward amount is invalid');
            return false;
          }
        } else {
          if (!Transaction.validTransaction(transaction)) {
            console.error('Invalid transaction');
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address
          });

          if(transaction.input.amount !== trueBalance) { 
            console.error('invalid input amount');
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error('An identical transaction appears multiple times in a block');
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }

    return true;
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

    replaceChain(chain, validateTransactions, onSuccess) { 

        if (chain.length <= this.chain.length){
            console.error('The incoming chain must be longer');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        if(validateTransactions && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid data');
            return;
        }

        if(onSuccess) onSuccess();
        console.log('replacing chain with', chain);        
        this.chain = chain;

    }

}

module.exports = Blockchain;