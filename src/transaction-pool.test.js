const TransactionPool = require('../wallet/transaction-pool.js');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/wallet');
const Blockchain = require('../blockchain/blockchain');

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: 'random recipient lol',
            amount: 2
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);
        
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })).toBe(transaction);
        });
    });

    describe('validTransactions()', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;

            for(let i = 0; i < 10; i++) {
                transaction = new Transaction( {
                    senderWallet,
                    recipient: 'any-recipient',
                    amount: 2
                } );

                if (i%3 === 0) {
                    // some invalid amounts
                    transaction.input.amount = 999999;
                } else if ( i%3 === 1) {
                    // some with invalid signatures
                    transaction.input.signature = (new Wallet).sign('wrong signature lol');
                } else {
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it('returns valid transactions', () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('logs error for the invalid transactions', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });

    describe('clear()', () => {
        it('clears the transactions', () => {
            transactionPool.clear();

            expect(transactionPool.transactionMap).toEqual({});
        });
    });

    describe('clearBlockchainTransactions()', () => {
        it('clears the pool of any existing blockchain transactions', () => {
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};

            for(let i = 0; i < 6; i++) {
                //making a unique transaction every time we run the loop
                const transaction = (new Wallet).createTransaction({
                    recipient: 'random recipient lol', amount: 1
                });

                //setting the unique transaction into the pool
                transactionPool.setTransaction(transaction);

                //half the time, add the transaction to the mined blockchain
                //other half, add the transaction to the blocks we expect to remain in the transaction pool
                if (i%2 == 0) {
                    blockchain.addBlock({ data: [transaction] });
                } else {
                    expectedTransactionMap[transaction.id] = transaction;
                }
            }

            transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
            
        });
    });

});