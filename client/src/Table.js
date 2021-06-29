import React from 'react';

class Table extends React.Component{
    render(){
        return(
            <table className='table table-hover'>
                <thead className='thead-dark'>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.candidates.map((candidate, key) => {
                        return(
                            <tr key={key}>
                                <th>{candidate.id}</th>
                                <th>{candidate.name}</th>
                                <th>{candidate.voteCount}</th>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
export default Table;