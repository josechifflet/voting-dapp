pragma solidity ^0.5.0;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    //Voters register
    mapping(address => bool) public votersRegister;

    //Admins register
    mapping(address => bool) private adminsRegister; //Los que pueden llamar a registerVoters

    constructor () public {
        addCandidate("Donald Trump");
        addCandidate("Joe Biden");
        // adminsRegister[0x3d9671839c2db7091Aa58178f05aD258bF339E86] = true;
        votersRegister[address(0xfB3d3D042259F518f028ed616Ee14a97ac18B8B4)] = true;
    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function registerVoters (address _address) public {
        // require(adminsRegister[msg.sender]);
        votersRegister[_address] = true;
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require that voter is registered
        require(votersRegister[address(msg.sender)]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}
