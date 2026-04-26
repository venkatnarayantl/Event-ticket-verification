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
import QRScanner from './QRScanner'; // Assuming your scanner is in the same folder

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'scan'
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !venue || !startTime) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.createEvent(eventName, eventDate, venue, startTime);
      await tx.wait();
      alert("Event Published Successfully!");
      setEventName(""); setEventDate(""); setVenue(""); setStartTime("");
    } catch (err) {
      console.error(err);
      alert("Only the Organizer can publish events.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tab Switcher */}
      <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl w-fit mb-10">
        <button 
          onClick={() => setActiveTab('scan')}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'scan' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
        >
          Scan QR
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'create' ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/20' : 'text-white/40 hover:text-white'}`}
        >
          Create Event
        </button>
      </div>

      {activeTab === 'create' ? (
        <div className="max-w-md bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
            <span className="text-amber-500 text-2xl">✦</span> Event Details
          </h2>
          
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Event Title</label>
              <input 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-amber-500/40 transition-all placeholder:text-white/10" 
                placeholder="e.g. SVCE Annual Fest" 
                value={eventName} 
                onChange={e => setEventName(e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Date</label>
              <input 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-amber-500/40 transition-all placeholder:text-white/10" 
                placeholder="DD/MM/YYYY" 
                value={eventDate} 
                onChange={e => setEventDate(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Venue</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-amber-500/40 transition-all placeholder:text-white/10" 
                  placeholder="Location" 
                  value={venue} 
                  onChange={e => setVenue(e.target.value)} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Time</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-amber-500/40 transition-all placeholder:text-white/10" 
                  placeholder="10:00 AM" 
                  value={startTime} 
                  onChange={e => setStartTime(e.target.value)} 
                />
              </div>
            </div>

            <button 
              onClick={handleCreateEvent}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black py-5 rounded-2xl mt-6 transition-all active:scale-[0.98] shadow-xl shadow-amber-500/10 uppercase tracking-widest italic"
            >
              {loading ? "Publishing..." : "Publish to Blockchain"}
            </button>
          </div>
        </div>
      ) : (
        <QRScanner />
      )}
    </div>
  );
}