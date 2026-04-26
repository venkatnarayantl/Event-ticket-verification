// import GenerateTicket from "./GenerateTicket";
// import TicketList from "./TicketList";
// import QRScanner from "./QRScanner";

// function OrganizerDashboard({ contract, account }) {
//   return (
//     <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h1>🎫 Organizer Dashboard</h1>
//         <div>
//           <span style={{ fontSize: "12px", color: "gray" }}>
//             {account.slice(0, 6)}...{account.slice(-4)}
//           </span>
//           <span style={{
//             marginLeft: "10px",
//             background: "green",
//             color: "white",
//             padding: "4px 10px",
//             borderRadius: "20px",
//             fontSize: "12px"
//           }}>
//             Organizer
//           </span>
//         </div>
//       </div>

//       <hr />
//       <GenerateTicket contract={contract} />
//       <hr />
//       <TicketList contract={contract} />
//       <hr />
//       <QRScanner contract={contract} />
//     </div>
//   );
// }

// export default OrganizerDashboard;


import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';
import QRScanner from './QRScanner';

export default function OrganizerDashboard() {
  const [tab, setTab] = useState('verify');
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Matches: function createEvent(string _name, string _date)
      const tx = await contract.createEvent(eventName, eventDate);
      await tx.wait();
      alert("Event Published! Attendees can now register.");
      setEventName(""); setEventDate("");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        <button onClick={() => setTab('verify')} className={`px-6 py-2 rounded-lg ${tab === 'verify' ? 'bg-amber-500 text-black' : 'text-white'}`}>Scan QR</button>
        <button onClick={() => setTab('create')} className={`px-6 py-2 rounded-lg ${tab === 'create' ? 'bg-amber-500 text-black' : 'text-white'}`}>Create Event</button>
      </div>

      {tab === 'create' ? (
        <div className="max-w-md bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
          <input placeholder="Event Title" className="w-full bg-transparent border border-white/10 p-4 rounded-xl" value={eventName} onChange={e => setEventName(e.target.value)} />
          <input placeholder="Date (DD/MM/YYYY)" className="w-full bg-transparent border border-white/10 p-4 rounded-xl" value={eventDate} onChange={e => setEventDate(e.target.value)} />
          <button onClick={handleCreateEvent} className="w-full bg-amber-500 text-black font-bold py-4 rounded-xl">PUBLISH EVENT</button>
        </div>
      ) : <QRScanner />}
    </div>
  );
}