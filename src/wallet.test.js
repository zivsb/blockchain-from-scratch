const Wallet = require('../wallet/wallet');
const Transaction = require('../wallet/transaction');
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
        const data = 'random data lol';

        
        it('verifies a signature', () => {
            //console.log(wallet.sign(data));
            expect(verifySignature({
                publicKey: wallet.publicKey,
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

    describe('createTransaction()', () => {
        describe('and the amount exceeds the balance', () => {
            it('throws an error', () => {
                expect(() => wallet.createTransaction({ amount: 999999, recipient: 'random recipient (lol)'})).toThrow('Amount exceeds balance');
            });
        });

        describe('and the amount is VALID', () => {
            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 5;
                recipient = 'da-boss';
                transaction = wallet.createTransaction({ amount, recipient });
            });

            it('creates an instance of `Transaction`', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches the transaction input with the wallet' , () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('outputs the amount the recipient' , () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
    });
});