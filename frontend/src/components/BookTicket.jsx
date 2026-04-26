import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';

export default function BookTicket() {
  const [events, setEvents] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      // Matches: function getAllEvents()
      const data = await contract.getAllEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      // Matches: function registerForEvent(uint256 _eventId, string _ownerName)
      const tx = await contract.registerForEvent(eventId, userName);
      await tx.wait();
      alert("Registration Successful! Check 'My Tickets' for your QR.");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="grid gap-6">
      {events.map((ev, i) => (
        <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4">
          <h3 className="text-xl font-bold">{ev.name}</h3>
          <p className="text-white/50">{ev.date}</p>
          <input placeholder="Enter Your Name" className="bg-white/10 p-3 rounded-lg" onChange={e => setUserName(e.target.value)} />
          <button onClick={() => handleRegister(ev.id)} className="bg-cyan-500 text-black font-bold py-2 rounded-lg">REGISTER</button>
        </div>
      ))}
    </div>
  );
}