// import { useState } from "react";
// import { ethers } from "ethers";
// import { CONTRACT_ADDRESS, CONTRACT_ABI, ORGANIZER_ADDRESS } from "./contract";
// import ConnectWallet from "./components/ConnectWallet";
// import OrganizerDashboard from "./components/OrganizerDashboard";
// import AttendeeDashboard from "./components/AttendeeDashboard";

// function App() {
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [isOrganizer, setIsOrganizer] = useState(false);

//   const connectWallet = async () => {
//     if (typeof window.ethereum === "undefined") {
//       alert("MetaMask not found! Please install it.");
//       return;
//     }

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = await provider.getSigner();
//       const address = await signer.getAddress();

//       const ticketContract = new ethers.Contract(
//         CONTRACT_ADDRESS,
//         CONTRACT_ABI,
//         signer
//       );

//       setAccount(address);
//       setContract(ticketContract);
//       setIsOrganizer(address.toLowerCase() === ORGANIZER_ADDRESS.toLowerCase());

//     } catch (err) {
//       console.error(err);
//       alert("Connection failed: " + err.message);
//     }
//   };

//   return (
//     <div>
//       {!account ? (
//         <ConnectWallet onConnect={connectWallet} />
//       ) : isOrganizer ? (
//         <OrganizerDashboard contract={contract} account={account} />
//       ) : (
//         <AttendeeDashboard contract={contract} account={account} />
//       )}
//     </div>
//   );
// }

// export default App; 


import { useState } from 'react';
import { ethers } from 'ethers';
import { ORGANIZER_ADDRESS, switchToLocal } from './contract';
import OrganizerDashboard from './components/OrganizerDashboard';
import AttendeeDashboard from './components/AttendeeDashboard';

function App() {
  const [account, setAccount] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      await switchToLocal();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setIsOrganizer(accounts[0].toLowerCase() === ORGANIZER_ADDRESS.toLowerCase());
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-mono">
      <header className="border-b border-white/10 p-6 flex justify-between items-center bg-white/[0.02] backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${isOrganizer ? 'bg-amber-500' : 'bg-cyan-500'}`} />
          <h1 className="text-xl font-bold tracking-tighter uppercase">ChainPass <span className="text-white/40">v1.0</span></h1>
        </div>
        
        {!account ? (
          <button onClick={connectWallet} className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-cyan-400 transition-all">
            CONNECT WALLET
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            {isOrganizer && <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 px-3 py-1 rounded text-[10px] font-bold">ORGANIZER</span>}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {!account ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl font-black mb-4 tracking-tighter">EVENT VERIFICATION <br/>ON-CHAIN</h2>
            <button onClick={connectWallet} className="mt-6 px-10 py-4 bg-cyan-500 text-black font-black rounded-full">GET STARTED</button>
          </div>
        ) : (
          isOrganizer ? <OrganizerDashboard /> : <AttendeeDashboard account={account} />
        )}
      </main>
    </div>
  );
}

export default App;