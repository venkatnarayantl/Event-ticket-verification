// ==============================
// CONTRACT CONFIG
// ==============================
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  "function createTicket(string memory eventName, string memory ownerName) public returns (uint256)",
  "function validateTicket(uint256 ticketId) public view returns (bool isValid, string memory eventName, string memory ownerName)",
  "function useTicket(uint256 ticketId) public",
  "function ticketCount() public view returns (uint256)",
  "function getTicketCount() public view returns (uint256)",
  "event TicketCreated(uint256 ticketId, string eventName, string ownerName)",
  "event TicketUsed(uint256 ticketId)"
];

// ==============================
// GLOBAL VARIABLES
// ==============================
let provider;
let signer;
let contract;

// ==============================
// STEP 1: CONNECT METAMASK
// ==============================
document.getElementById("connectBtn").addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not found! Please install it.");
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    document.getElementById("walletAddress").innerText = "Connected: " + address;
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("Wallet connected!", address);
  } catch (err) {
    console.error(err);
    alert("Connection failed: " + err.message);
  }
});

// ==============================
// STEP 2: GENERATE TICKET + QR
// ==============================
document.getElementById("generateBtn").addEventListener("click", async () => {
  if (!contract) { alert("Please connect wallet first!"); return; }

  const eventName = document.getElementById("eventName").value;
  const ownerName = document.getElementById("ownerName").value;

  if (!eventName || !ownerName) {
    alert("Please fill in both fields!");
    return;
  }

  try {
    document.getElementById("generateStatus").innerText = "Creating ticket on blockchain...";

    const tx = await contract.createTicket(eventName, ownerName);
    await tx.wait();

    // Get the ticket count (which is the new ticket's ID)
    const id = (await contract.getTicketCount()).toString();


    document.getElementById("generateStatus").innerText = "✅ Ticket Created! ID: " + id;
    document.getElementById("ticketIdDisplay").innerText = "Ticket ID: " + id;

    // Generate QR Code
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
      text: id,
      width: 180,
      height: 180,
    });

  } catch (err) {
    console.error(err);
    document.getElementById("generateStatus").innerText = "❌ Error: " + err.message;
  }
});

// ==============================
// STEP 3: VERIFY TICKET
// ==============================
document.getElementById("verifyBtn").addEventListener("click", async () => {
  if (!contract) { alert("Please connect wallet first!"); return; }

  const ticketId = document.getElementById("verifyId").value;
  if (!ticketId) { alert("Enter a ticket ID!"); return; }

  try {
    const result = await contract.validateTicket(ticketId);
    const isValid = result[0];
    const eventName = result[1];
    const ownerName = result[2];

    if (isValid) {
      document.getElementById("verifyStatus").innerText =
        `✅ VALID TICKET | Event: ${eventName} | Owner: ${ownerName}`;
    } else {
      document.getElementById("verifyStatus").innerText =
        `❌ INVALID or USED TICKET`;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("verifyStatus").innerText = "❌ Error: " + err.message;
  }
});

// ==============================
// STEP 4: MARK TICKET AS USED
// ==============================
document.getElementById("useBtn").addEventListener("click", async () => {
  if (!contract) { alert("Please connect wallet first!"); return; }

  const ticketId = document.getElementById("useId").value;
  if (!ticketId) { alert("Enter a ticket ID!"); return; }

  try {
    document.getElementById("useStatus").innerText = "Processing...";
    const tx = await contract.useTicket(ticketId);
    await tx.wait();
    document.getElementById("useStatus").innerText = "✅ Ticket marked as used!";
  } catch (err) {
    console.error(err);
    document.getElementById("useStatus").innerText = "❌ Error: " + err.message;
  }
});