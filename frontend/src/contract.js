export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  "function createTicket(string memory eventName, string memory ownerName) public returns (uint256)",
  "function validateTicket(uint256 ticketId) public view returns (bool isValid, string memory eventName, string memory ownerName)",
  "function useTicket(uint256 ticketId) public",
  "function ticketCount() public view returns (uint256)",
  "event TicketCreated(uint256 ticketId, string eventName, string ownerName)",
  "event TicketUsed(uint256 ticketId)"
];

export const ORGANIZER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";