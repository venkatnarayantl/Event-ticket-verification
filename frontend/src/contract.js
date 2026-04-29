// export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// export const CONTRACT_ABI = [
//   "function createTicket(string memory eventName, string memory ownerName) public returns (uint256)",
//   "function validateTicket(uint256 ticketId) public view returns (bool isValid, string memory eventName, string memory ownerName)",
//   "function useTicket(uint256 ticketId) public",
//   "function ticketCount() public view returns (uint256)",
//   "event TicketCreated(uint256 ticketId, string eventName, string ownerName)",
//   "event TicketUsed(uint256 ticketId)"
// ];

// export const ORGANIZER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";


export const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
export const ORGANIZER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
export const LOCAL_CHAIN_ID = "0x7a69";

export const CONTRACT_ABI = [
    "function createEvent(string _name, string _date, string _venue, string _startTime) public",
    "function registerForEvent(uint256 _eventId, string _ownerName) public",
    "function verifyAndUseTicket(uint256 _ticketId) public",
    
    // FIXED: Tuple must contain all 6 fields to match the Event struct in Solidity
    // MUST MATCH: uint256 id, string name, string date, string venue, string startTime, bool active
"function getAllEvents() view returns (tuple(uint256 id, string name, string date, string venue, string startTime, bool active)[])",
    
    // FIXED: Tuple must contain all 5 fields to match the Ticket struct in Solidity
    "function getMyTickets(address _user) view returns (tuple(uint256 ticketId, uint256 eventId, string ownerName, address ownerAddress, bool isValid)[])",
    
    "function tickets(uint256) view returns (uint256 ticketId, uint256 eventId, string ownerName, address ownerAddress, bool isValid)",
    "function events(uint256) view returns (uint256 id, string name, string date, string venue, string startTime, bool active)"
];

export const switchToLocal = async () => {
    if (!window.ethereum) return;
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: LOCAL_CHAIN_ID }],
        });
    } catch (error) {
        if (error.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: LOCAL_CHAIN_ID,
                    chainName: 'Hardhat Local',
                    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['http://127.0.0.1:8545'],
                }],
            });
        }
    }
};