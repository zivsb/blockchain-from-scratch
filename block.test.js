//the .js extension is implicitly set by node js
const hexToBinary = require('hex-to-binary');
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({timestamp, lastHash, hash, data, nonce, difficulty});


    //creating a test that ensures the block created has the expected values
    //usually best practice to only have one expect per it statement
    it('has the expected timestamp, lastHash, hash, and data properties', () => {
        
        //expect ACTUAL to equal EXPECTED
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        // console.log( genesisBlock );

        it('returns a Blok instance', () => {
            expect(genesisBlock instanceof Block).toEqual(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';

        //result the newly created mined block
        const result = Block.mineBlock( { lastBlock, data } );

        it('returns a Block instance', () => {

            // toBe() is a faster version of .toEqual() used for primitives
            expect(result instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(result.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(result.data).toEqual(data);
        });

        it('sets a `timestamp`', () => {
            expect(result.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` for the inputs', () => {
            expect(result.hash)
            .toEqual(
                cryptoHash(
                    result.timestamp,
                    result.nonce,
                    result.difficulty,
                    lastBlock.hash,
                    data
                )
            );
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(result.hash).substring(0, result.difficulty))
            .toEqual('0'.repeat(result.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];

            expect(possibleResults.includes(result.difficulty)).toBe(true);
        });

    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({ 
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty+1);
        });

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty-1);

        });

        it('has a lower limit of 1', () => {
            block.difficulty = -1;

            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
        })
    })
});