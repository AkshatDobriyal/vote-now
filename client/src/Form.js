import React from 'react';

class Form extends React.Component{
    render(){
        return(
            <form onSubmit={(event) => {
                event.preventDefault();
                const candidateId = this.candidateId.value
                this.props.castVote(candidateId);
            }}>
                <div className='form-group'>
                    <label><strong>SELECT CANDIDATE</strong></label>
                    <select ref={(input) => this.candidateId = input} className='form-control'>
                        {this.props.candidates.map((candidate, key) => {
                            return(
                                <option key={key} value={candidate.id}>{candidate.name}</option>
                            );
                        })}
                    </select>
                </div>
                <button type='submit' className='btn btn-primary'><strong>Vote</strong></button>
                <hr/>
            </form>
        );
    }
}
export default Form;