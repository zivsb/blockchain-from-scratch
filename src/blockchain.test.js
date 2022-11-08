const Blockchain = require('../blockchain/blockchain');
const Block = require('../blockchain/block');
const { cryptoHash } = require('../util/util');
const Wallet = require('../wallet/wallet' );
const Transaction = require('../wallet/transaction');

describe('Blockchain', () => {
    let blockchain, newChain, originalChain, errorMock;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        errorMock = jest.fn();

        originalChain = blockchain.chain;
        global.console.error = errorMock;
    })

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    // it('starts with a genesis block', () => {
    //     expect(blockchain.chain[0]).toEqual(Block.genesis());
    // });

    // it('adds a new block to the chain', () => {
    //     const newData = 'new data added';
    //     blockchain.addBlock({data: newData});

    //     expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    // });

    //extensive test to make sure the validation function validates properly
    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'example of an invalide genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {
            beforeEach(() => {

                blockchain.addBlock({ data: 'data 1'});
                blockchain.addBlock({ data: 'data 2'});
                blockchain.addBlock({ data: 'data 3'});
            });

            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    

                    blockchain.chain[2].lastHash = 'fake lastHash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
        
        
            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', ( )=> {
    
                    blockchain.chain[2].data = 'fake data';
    
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with a jumped difficulty', () => {
                it('returns false', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length -1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

                    const badBlock = new Block({ timestamp, lastHash, hash, nonce, difficulty, data });

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            })
    
            describe('and the chain does not contain any invalid blocks', () => {
                it('returns true', () => {
    
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        
        
        
        });

        

    });

    describe('replaceChain()', () => {
        let logMock;

        // silencing function output on the testcases
        // doing this by reffering the logs to jest.fn()
        beforeEach(() => {
            logMock = jest.fn();

            global.console.log = logMock;
        });

        describe('when the new chain isn\'t longer', () => {
            beforeEach(() => {
                newChain.chain[0] = { new: 'chain' };
                
                blockchain.replaceChain(newChain.chain);
            });
            
            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'data 1'});
                newChain.addBlock({ data: 'data 2'});
                newChain.addBlock({ data: 'data 3'});
            });

            


            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                
                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacement', () => {
                    expect(logMock).toHaveBeenCalled;
                });
            });

            describe('and the chain is not valid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = 'a fake hash';
                
                    blockchain.replaceChain(newChain.chain);
                });
                
                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

        });

        describe('and the `validateTransactions` flag is true', () => {
            it('calls valid TransactionData() ' , () => {
                const validTransactionDataMock = jest.fn();
                blockchain.validTransactionData = validTransactionDataMock;
                newChain.addBlock({ data: 'lol random data' });
                blockchain. replaceChain(newChain.chain, true);

                expect(validTransactionDataMock).toHaveBeenCalled();
            });
        });
    });

    describe('validTransactionData()', () => {
        let transaction, rewardTransaction, wallet;
        beforeEach(() => {
          wallet = new Wallet();
          transaction = wallet.createTransaction({ recipient: 'lol', amount: 2 });
          rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
        });
    
        describe('and the transaction data is valid', () => {
          it('returns true', () => {
            newChain.addBlock({ data: [transaction, rewardTransaction] });
    
            expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(true);
            expect(errorMock).not.toHaveBeenCalled();
          });
        });
    
        describe('and the transaction data has multiple rewards', () => {
          it('returns false ansd logs an error', () => {
            newChain.addBlock({ data: [transaction, rewardTransaction, rewardTransaction] });
    
            expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
            expect(errorMock).toHaveBeenCalled();
          });
        });
    
        describe('and the transaction data has at least one malformed outputMap', () => {
          describe('and the transaction is not a reward transaction', () => {
            it('returns false and logs an error', () => {
              transaction.outputMap[wallet.publicKey] = 999999;
    
              newChain.addBlock({ data: [transaction, rewardTransaction ]});
    
              expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
              expect(errorMock).toHaveBeenCalled();
            });
          });
    
          describe('and the transaction is a reward transaciton', () => {
            it('returns false and logs an error', () => {
              rewardTransaction.outputMap[wallet.publicKey] = 999999;
    
              newChain.addBlock({ data: [transaction, rewardTransaction] });
    
              expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
              expect(errorMock).toHaveBeenCalled();
            });
          });
        });
    
        describe('and the transaction data has at least one malformed input', () => {
          it('returns false and logs an error', () => {
            wallet.balance = 9;

            const falseOutputMap = {
                [wallet.publicKey]: 8,
                recipient: 21
            };

            const falseTransaction = {
                input: {
                    timestamp: Date.now(),
                    amount: wallet.balance,
                    address: wallet.publicKey,
                    signature:wallet.sign(falseOutputMap)
                },
                outputMap: falseOutputMap
            }

            newChain.addBlock({ data: [falseTransaction, rewardTransaction] });
            expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
            expect(errorMock).toHaveBeenCalled();
          });
        });
    
        describe('and a block contains multiple identical transactions', () => {
          it('returns false and logs an error', () => {
            newChain.addBlock({
                data: [ transaction, transaction, transaction, rewardTransaction]
            });

            expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
            expect(errorMock).toHaveBeenCalled();

          });
        });
      });
});
