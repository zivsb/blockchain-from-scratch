import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import history from "../history";
import Transaction from "./Transaction";


const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    }

    fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
            .then(response => {
                if (response.status === 200) {
                    alert('success');
                    history.push('/blocks');
                } else {
                    alert('Could not complete the mining request');
                }
            });
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMap = setInterval(
            () => this.fetchTransactionPoolMap(),
            POLL_INTERVAL_MS
        )
    }

    componentWillUnmount() {
        clearInterval(this.fetchPoolMap);
    }

    render() {
        return (
            <div className='TransactionPool'>
                <div><Link to='/'>Home</Link></div>
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }
                <hr />
                <Button bsStyle="danger" onClick={this.fetchMineTransactions}>Mine the Transaction Pool</Button>
            </div>
        )
    }
}

export default TransactionPool;