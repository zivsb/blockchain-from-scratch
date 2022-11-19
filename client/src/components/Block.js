import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component {
    state = { displayTransaction: false };

    toggleTransaction = () => {
        this.setState({ displayTransaction: ! this.state.displayTransaction });
    }

    get displayTransaction() {
        const { data } = this.props.block;


        const stringifiedData = JSON.stringify(data);
        
        /*const dataDisplay = stringifiedData.length > 35 ?
            `${stringifiedData.substring(0, 35)}...` :
            stringifiedData;*/

        if (this.state.displayTransaction) { 
            return (
                <div>
                    {
                        data.map(transaction => (
                            <div key={transaction.id}>
                                
                                <Transaction transaction={transaction} />
                            </div>
                        ))
                    }
                    <br />

                    <Button
                        bsStyle="danger"
                        bsSize="small"
                        onClick={this.toggleTransaction}
                    >
                        Hide Data
                    </Button>
                </div>
                
            );
        }

        return (
            <div>
                <div></div>
                <Button
                    bsStyle="danger"
                    bsSize="small"
                    onClick={this.toggleTransaction}
                >
                    View Block's Data
                </Button>
            </div>
        );
    }

    render() {
        console.log('this.displayTransaction', this.displayTransaction);

        const { timestamp, hash } = this.props.block;

        const subHash = `${hash.substring(0, 10)}...`;
       

        //const dataDisplay = `${stringifiedData}`

        return (
            <div className="Block">
                <hr />
                <div>Hash: {subHash}</div>
                <div>Mined on: {(new Date(timestamp)).toLocaleDateString()}</div>

                {this.displayTransaction}
            </div>
        );
    }
}

export default Block;