const Wallet = require('../../wallet/wallet');
import history from './history';

const massTransact = (wallet, blockchain) => {
    const wallet1 = new Wallet();
    const wallet2 = new Wallet();
    const wallet3 = new Wallet();
    const wallet4 = new Wallet();

    let conductTransaction = (recipient, amount) => {
        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
            .then(json => {
                // alert(json.message || json.type);
                history.push('/transaction-pool');
            });
    }
    
    const generateWalletTransaction = ({wallet, recipient, amount}) => {
        const transaction = conductTransaction(recipient, amount);
    };

    


    const walletAction = () => generateWalletTransaction({
        wallet, recipient: wallet1.publicKey, amount: 3
    });

    const wallet1Action = () => generateWalletTransaction({
        wallet: wallet1, recipient: wallet2.publicKey, amount: 2
    });

    const wallet2Action = () => ({
        wallet: wallet2, recipient: wallet.publicKey, amount: 1
    });

    const wallet3Action = () => generateWalletTransaction({
        wallet: wallet3, recipient: wallet3.publicKey, amount: 2
    });

    const wallet4Action = () => generateWalletTransaction({
        wallet: wallet4, recipient: wallet4.publicKey, amount: 2
    });

    for (let i = 0; i < 10; i++) {
        switch (Math.floor(Math.random() * 5)) {
            case 0:
                walletAction();
                wallet1Action();
                break;
            case 1:
                walletAction();
                wallet2Action();
                break;
            case 2:
                wallet1Action();
                wallet2Action();
            case 3:
                wallet3Action();
                wallet1Action();
            case 4:
                wallet3Action();
                wallet4Action();
            default:
                wallet4Action();
                wallet1Action()
        }

        fetch(`${document.location.origin}/api/mine-transactions`)
            .then(response => {
                if (response.status === 200) {
                    // alert('success');
                    history.push('/blocks');
                } else {
                    // alert('Could not complete the mining request');
                }
            });
    }

    // console.log("Mass Transactions Ran");
}

module.exports = massTransact;