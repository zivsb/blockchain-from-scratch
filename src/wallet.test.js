const Wallet = require('../wallet/wallet');
const { verifySignature } = require('../util/util');

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it('has a `balance`', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a `publicKey`', () =>{
        //console.log(wallet.publicKey);

        expect(wallet).toHaveProperty('publicKey');
    });

    describe('signing data', () => {
        const data = 'foobar';

        
        it('verifies a signature', () => {
            console.log(wallet.sign(data));
            expect(verifySignature({
                publicKey: wallet.data,
                data,
                signature: wallet.sign(data)
            })).toBe(true);

            
        });

        it('does not verify an invalid signature', () => {
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: (new Wallet).sign(data)
            })).toBe(false);
        });
    });
});