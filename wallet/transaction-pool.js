const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    clear() {
        this.transactionMap = {};
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    existingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);

        return transactions.find(transaction => transaction.input.address === inputAddress);
    }

    validTransactions() {
        return Object.values(this.transactionMap).filter((transaction) => {
            return Transaction.validTransaction(transaction);
        });
    }

    clearBlockchainTransactions({ chain }) {
        //start at 1 to skip genesis block
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            //go through every transaction of the block.data
            //delete the transactions in the pool that are mined
            for (let transaction of block.data) {
                if (this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
    
}

module.exports = TransactionPool;