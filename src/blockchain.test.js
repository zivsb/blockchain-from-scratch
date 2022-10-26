const Blockchain = require('../blockchain/blockchain');
const Block = require('../blockchain/block');
const { cryptoHash } = require('../util/util');

describe('Blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
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
        let errorMock, logMock;

        // silencing function output on the testcases
        // doing this by reffering the logs to jest.fn()
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
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
    });

});
