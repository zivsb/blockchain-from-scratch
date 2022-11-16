import React, { Component } from "react";

class Block extends Component {
    render() {
        const { timestamp, hash, data } = this.props.block;

        const subHash = `${hash.substring(0, 10)}...`;
        const stringifiedData = JSON.stringify(data);

        //const dataDisplay = `${stringifiedData}`

        return (
            <div className="Block">
                <div>Hash: {subHash}</div>
                <div>Timestamp: {timestamp}</div>
                <div>Data: {stringifiedData}</div>
            </div>
        );
    }
}

export default Block;