import React, { Component } from "react";
import ReactDom from "react-dom";
import getWeb3 from "./getWeb3";
import Election from "./contracts/Election.json";
import Content from "./Content";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      account: '',
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
      web3: null,
      accounts: null,
      election: null
    }

    this.castVote = this.castVote.bind(this);
    this.watchEvents = this.watchEvents.bind(this);
  }

  componentDidMount = async() => {
    // TODO: Refactor with promise chain
    try{
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      this.setState({ account: accounts[0] });

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const networkData = Election.networks[networkId];
      const election = new web3.eth.Contract(Election.abi, '0xcDdE6C7A5ABA888056D75bD2Ad4FCd5952A04542');

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, election });

      const candidatesCount = await election.methods.candidatesCount().call();
      this.setState({ candidatesCount });

      for(var i=1; i<=candidatesCount; i++){
          const candidate = await election.methods.candidates(i).call();
            this.setState({ 
              candidates: [...this.state.candidates, candidate]
            });
          }
      const voter = election.methods.voters(this.state.account).call();
        this.setState({ 
          hasVoted: voter.hasVoted,
          loading: false 
        });
      }
      catch(error){
        // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
      }
  }

  watchEvents(){
    // TODO: trigger event when vote is counted, not when component renders
    this.election.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({voting: false});
    });
  }

  castVote = candidateId => {
    this.setState({voting: true});
    this.state.election.methods.vote(candidateId).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({
        hasVoted: true,
        voting: false,
        loading: false
      });
    });
  }
   render(){
     return(
       <div className='row'>
          <div className='col-lg-12 text-center'>
            <h1>Election Results</h1>
            <br/>
            {this.state.loading || this.state.voting
              ? <p className='text-center'>Loading...</p>
              : <Content
                  account = {this.state.account}
                  candidates = {this.state.candidates}
                  hasVoted = {this.state.hasVoted}
                  castVote = {this.castVote} />      
            }
          </div> 
       </div>
     );
   }
}

//ReactDOM.render(<App />, document.getElementById('root'));
export default App;