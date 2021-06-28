var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts){
    var electionInstance;
    
    it("initializes with two candidates", function(){
        return Election.deployed().then((instance) => {
            return instance.candidatesCount();
        }).then((count) => {
            assert.equal(count, 2);
        });
    });

    it("initializes the candidates with correc values", function(){
        return Election.deployed().then((instance) => {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then((candidate) => {
            assert.equal(candidate[0], 1, "contains the correct id");
            assert.equal(candidate[1], "Akshat Dobriyal", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");
            return electionInstance.candidates(2);
        }).then((candidate) => {
            assert.equal(candidate[0], 2, "contains the correct id");
            assert.equal(candidate[1], "Anuj Pillai", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");
        });
    });

    it("allows a voter to cast a vote", function(){
        return Election.deployed().then((instance) => {
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, { from: accounts[0] });
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
            return electionInstance.voters(accounts[0]);
        }).then((voted) => {
            assert(voted, "the voter was marked as voted");
            return electionInstance.candidates(candidateId);   
        }).then((candidate) => {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "increments the candidate's vote count");
        });
    });

    it("throws an exception for invalid candidate", function(){
        return Election.deployed().then((instance)=>{
            electionInstance = instance;
            return electionInstance.vote(99, {from: accounts[1]});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then((candidate) => {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then((candidate) => {
            var voteCount = candidate[2];
            assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        });
    });

    it("throws an exception for double voting", function(){
        return Election.deployed().then((instance) => {
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId, {from: accounts[1]});
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "accepts first vote");
            // try to vote again
            return electionInstance.vote(candidateId, {from: accounts[1]});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then((candidate) => {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then((candidate) => {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidte 2 did not receive any votes");
        });
    });
});
