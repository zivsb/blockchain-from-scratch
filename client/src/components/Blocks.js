import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';

class Blocks extends Component {
    state = { blocks:  [] };

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render() {
        console.log('this.state', this.state);
        return(
            <div>
                <div><Link to='/'>Home</Link></div>
                <h2>Blocks:</h2>
                {
                    //this.state.blocks.reverse();
                    this.state.blocks.reverse().map((block) => {
                        return (
                            <Block key={block.hash} block={block} />
                        )
                    })
                }
            </div>
        )
    }
}

export default Blocks;