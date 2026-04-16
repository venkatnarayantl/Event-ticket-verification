//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract TicketNFT {
    //struct for ticket 
    struct Ticket{ 
        uint256 ticketId;
        string eventName;
        string ownerName;
        bool isValid;
    }

    //store tickets 
    mapping(uint256=>Ticket) public tickets;
    uint256 public ticketCount;
    address public organizer;

    //events 
    event TicketCreated(uint256 ticketId, string eventName , string ownerName);
    event TicketUsed(uint256 ticketId);

    //setting organizer as the contract deployer where he can create tickets and validate them
    constructor() {
        organizer = msg.sender;
    }

    modifier onlyOrganizer {
        require (msg.sender == organizer, "Only organizer can perform this action");
        _; // to continue execution of the function
    }

    //create a ticket 
    function createTicket(string memory _eventName, string memory _ownerName) //memory means the data is stored temporarily during function execution
        public onlyOrganizer returns(uint256){
            ticketCount++;
            tickets[ticketCount] = Ticket(ticketCount, _eventName, _ownerName, true);
            emit TicketCreated(ticketCount, _eventName, _ownerName);
            return ticketCount;
        }
    
    //validate a ticket
    function validateTicket(uint256 ticketId) public view  returns (bool isValid, string memory eventName, string memory ownerName) {
        Ticket memory t = tickets [ticketId];
        return (t.isValid, t.eventName, t.ownerName);
        
    }

    //mark a ticket as used
    function useTicket(uint ticketId) public onlyOrganizer{
        require(tickets[ticketId].isValid, "Ticket is not valid");
        tickets[ticketId].isValid = false;
        emit TicketUsed(ticketId);
    }

    function getTicketCount() public view returns (uint256) {
    return ticketCount;
}

}


