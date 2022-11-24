import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const massTransact = require('../massTransact');

class App extends Component{
    state = { walletInfo: {  }, blocks: { }, scriptRan : false };

    runScript = () => {
        massTransact(this.state.walletInfo, this.state.blocks);
        this.setState({scriptRan : true});
    }

    get showButton() {
        if (this.state.blocks.length < 2) {
            return (
                <Button onClick={this.runScript}>Jumpstart the Blockchain</Button>
            )
        }
        return (
            <p></p>
        );
    }
    
    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }));
        fetch(`${document.location.origin}/api/blocks`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json}));
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div className='App'>
                <div><h1>Interact With the Bitcoin Copy</h1></div>
                <br />
                <div><Link to ='/blocks'>View Blocks</Link></div>
                <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
                <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
                {this.showButton}
                <br />
                <div className='WalletInfo'>
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;