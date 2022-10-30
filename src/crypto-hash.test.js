const { cryptoHash } = require('../util/util');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('original data to be hashed'))
        .toEqual('282bfe26b1440e80e4c874c3a5d19601b6c95e3092ec0dce365c972daef3e97d');
    });

    it('produces the same hash per the same input, regaurdless of order', () => {
        expect(cryptoHash('one', 'two', 'three'))
        .toEqual(cryptoHash('three', 'one', 'two'));
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const originalObj = {};
        const originalHash = cryptoHash(originalObj);
        originalObj['a'] = 'a';

        expect(cryptoHash(originalObj)).not.toEqual(originalHash);

    });

});