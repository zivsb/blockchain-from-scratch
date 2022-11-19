import React from 'react';

const Transaction = ({ transaction }) => {

    const { input, outputMap } = transaction;
    const recipients = Object.keys(outputMap);

    return (
        <div className='Transaction'>
            <div>Sender: {`${input.address.substring(0, 20)}...`} | Balance: {input.amount}</div>
            <div>Recipients:   </div>
            {
                recipients.map(recipient => {
                    return (
                        <div key={recipient}>
                            {`${recipient.substring(0, 20)}...`} | Amount: {outputMap[recipient]}
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Transaction;