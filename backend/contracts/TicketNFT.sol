// //SPDX-License-Identifier: MIT 
// pragma solidity ^0.8.0;

// contract TicketNFT {
//     //struct for ticket 
//     struct Ticket{ 
//         uint256 ticketId;
//         string eventName;
//         string ownerName;
//         bool isValid;
//     }

//     //store tickets 
//     mapping(uint256=>Ticket) public tickets;
//     uint256 public ticketCount;
//     address public organizer;

//     //events 
//     event TicketCreated(uint256 ticketId, string eventName , string ownerName);
//     event TicketUsed(uint256 ticketId);

//     //setting organizer as the contract deployer where he can create tickets and validate them
//     constructor() {
//         organizer = msg.sender;
//     }

//     modifier onlyOrganizer {
//         require (msg.sender == organizer, "Only organizer can perform this action");
//         _; // to continue execution of the function
//     }

//     //create a ticket 
//     function createTicket(string memory _eventName, string memory _ownerName) //memory means the data is stored temporarily during function execution
//         public onlyOrganizer returns(uint256){
//             ticketCount++;
//             tickets[ticketCount] = Ticket(ticketCount, _eventName, _ownerName, true);
//             emit TicketCreated(ticketCount, _eventName, _ownerName);
//             return ticketCount;
//         }
    
//     //validate a ticket
//     function validateTicket(uint256 ticketId) public view  returns (bool isValid, string memory eventName, string memory ownerName) {
//         Ticket memory t = tickets [ticketId];
//         return (t.isValid, t.eventName, t.ownerName);
        
//     }

//     //mark a ticket as used
//     function useTicket(uint ticketId) public onlyOrganizer{
//         require(tickets[ticketId].isValid, "Ticket is not valid");
//         tickets[ticketId].isValid = false;
//         emit TicketUsed(ticketId);
//     }

//     function getTicketCount() public view returns (uint256) {
//     return ticketCount;
// }

// }


//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract TicketNFT {
    struct Event {
        uint256 id;
        string name;
        string date;
        bool active;
    }

    struct Ticket { 
        uint256 ticketId;
        uint256 eventId;
        string ownerName;
        address ownerAddress;
        bool isValid;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    uint256 public eventCount;
    uint256 public ticketCount;
    address public organizer;

    constructor() { organizer = msg.sender; }

    // 1. ORGANIZER: Creates the Event
    function createEvent(string memory _name, string memory _date) public {
        require(msg.sender == organizer, "Only organizer");
        eventCount++;
        events[eventCount] = Event(eventCount, _name, _date, true);
    }

    // 2. ATTENDEE: Registers/Books themselves
    function registerForEvent(uint256 _eventId, string memory _ownerName) public {
        require(events[_eventId].active, "Event not active");
        ticketCount++;
        tickets[ticketCount] = Ticket(ticketCount, _eventId, _ownerName, msg.sender, true);
    }

    // 3. ORGANIZER: Scans and Marks as Used
    function verifyAndUseTicket(uint256 _ticketId) public {
        require(msg.sender == organizer, "Only organizer");
        require(tickets[_ticketId].isValid, "Already used or invalid");
        tickets[_ticketId].isValid = false;
    }

    // FETCHING FUNCTIONS
    function getAllEvents() public view returns (Event[] memory) {
        Event[] memory all = new Event[](eventCount);
        for(uint i=1; i<=eventCount; i++) { all[i-1] = events[i]; }
        return all;
    }

    function getMyTickets(address _user) public view returns (Ticket[] memory) {
        uint count = 0;
        for(uint i=1; i<=ticketCount; i++) { if(tickets[i].ownerAddress == _user) count++; }
        Ticket[] memory res = new Ticket[](count);
        uint index = 0;
        for(uint i=1; i<=ticketCount; i++) {
            if(tickets[i].ownerAddress == _user) { res[index] = tickets[i]; index++; }
        }
        return res;
    }
}