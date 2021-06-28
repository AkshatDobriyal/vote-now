// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.4;

contract Election {
    // model candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    // store accounts that have voted
    mapping(address => bool) public voters;
    // store candidates
    // fetch candidate
    mapping(uint256 => Candidate) public candidates;

    // voted event
    event votedEvent(uint256 indexed _candidateId);

    uint256 public candidatesCount;

    constructor() public {
        addCandidate("Akshat Dobriyal");
        addCandidate("Anuj Pillai");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint256 _candidateId) public {
        // require that they haven't voted yet
        require(!voters[msg.sender], "You have already voted");
        // require a valid candidate
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Not a valid candidate"
        );
        // record that voter has voted
        voters[msg.sender] = true;
        // update candidate vote count
        candidates[_candidateId].voteCount++;
        // trigger voted event
        emit votedEvent(_candidateId);
    }
}
