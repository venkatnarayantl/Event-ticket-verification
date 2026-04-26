import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { QRCodeSVG } from 'qrcode.react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';

export default function MyTickets({ account }) {
  const [tickets, setTickets] = useState([]);
  const [showQR, setShowQR] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!account) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        
        // 1. Get all tickets owned by this user
        const myTicketsData = await contract.getMyTickets(account);
        
        // 2. For each ticket, fetch the specific event details using the eventId
        const enrichedTickets = await Promise.all(
          myTicketsData.map(async (t) => {
            const eventDetails = await contract.events(t.eventId);
            return {
              id: t.ticketId.toString(),
              eventName: eventDetails.name,
              eventDate: eventDetails.date,
              holder: t.ownerName,
              valid: t.isValid
            };
          })
        );

        setTickets(enrichedTickets);
      } catch (err) {
        console.error("Error enrichment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserTickets();
  }, [account]);

  if (loading) return <div className="text-center p-10 text-white/50">Loading your passes...</div>;

  return (
    <div className="grid gap-6">
      {tickets.length > 0 ? (
        tickets.map((t, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center">
            <div className="space-y-1">
              {/* Added Event Name and Date here */}
              <h3 className="text-2xl font-bold text-white">{t.eventName}</h3>
              <p className="text-amber-500 font-medium">{t.eventDate}</p>
              
              <div className="pt-4">
                <p className="text-white/40 text-sm">Holder: <span className="text-white/80">{t.holder}</span></p>
                <p className={`text-sm mt-1 flex items-center gap-2 ${t.valid ? "text-emerald-400" : "text-red-400"}`}>
                   <span className={`w-2 h-2 rounded-full ${t.valid ? "bg-emerald-400" : "bg-red-400"}`}></span>
                   {t.valid ? "Active Ticket" : "Used"}
                </p>
              </div>
            </div>

            {t.valid && (
              <button 
                onClick={() => setShowQR(t.id)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-2xl transition-all"
              >
                View QR
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="text-white/30 text-center py-20 italic">No tickets registered yet.</div>
      )}

      {/* QR Modal remains the same */}
      {showQR && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setShowQR(null)}>
          <div className="bg-white p-8 rounded-3xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <QRCodeSVG value={showQR} size={250} />
            <p className="text-black font-bold mt-4">TICKET ID: #{showQR}</p>
            <button onClick={() => setShowQR(null)} className="mt-4 text-red-500 text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}