import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, ORGANIZER_ADDRESS } from "./contract";
import ConnectWallet from "./components/ConnectWallet";
import OrganizerDashboard from "./components/OrganizerDashboard";
import AttendeeDashboard from "./components/AttendeeDashboard";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not found! Please install it.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const ticketContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setAccount(address);
      setContract(ticketContract);
      setIsOrganizer(address.toLowerCase() === ORGANIZER_ADDRESS.toLowerCase());

    } catch (err) {
      console.error(err);
      alert("Connection failed: " + err.message);
    }
  };

  return (
    <div>
      {!account ? (
        <ConnectWallet onConnect={connectWallet} />
      ) : isOrganizer ? (
        <OrganizerDashboard contract={contract} account={account} />
      ) : (
        <AttendeeDashboard contract={contract} account={account} />
      )}
    </div>
  );
}

export default App; 