const { cryptoHash } = require('../util/util');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('original data to be hashed'))
        .toEqual('beb7f7da9990e165d05b166689c5ba55441735ec023c5c52876fbdd9a2ba4c78');
    });

    it('produces the same hash per the same input, regaurdless of order', () => {
        expect(cryptoHash('one', 'two', 'three'))
        .toEqual(cryptoHash('three', 'one', 'two'));
    });


});