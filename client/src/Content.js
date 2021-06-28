import React from 'react';
import Table from './Table';
import Form from './Form';

class Content extends React.Component{
    render(){
        return(
            <div>
                <Table candidates = {this.props.candidates} />
                <hr/>
                {!this.props.hasVoted ?
                    <Form candidates = {this.props.candidates} castVote = {this.props.castVote} />
                    : null
                }
                <a href={"https://etherscan.io/address/" + this.props.account} className='account'><strong>Voter Account: {this.props.account}</strong></a>
            </div>
        );
    }
}
export default Content;