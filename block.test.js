//the .js extension is implicitly set by node js
const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe('Block', () => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const block = new Block({
        timestamp: timestamp,
        lastHash: lastHash,
        hash: hash,
        data: data
    });

    //creating a test that ensures the block created has the expected values
    //usually best practice to only have one expect per it statement
    it('has the expected timestamp, lastHash, hash, and data properties', () => {
        
        //expect ACTUAL to equal EXPECTED
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
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
            .toEqual(cryptoHash(result.timestamp, lastBlock.hash, data));
        });

    });
});