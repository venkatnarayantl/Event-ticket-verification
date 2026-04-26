// import { useState } from "react";

// function TicketList({ contract }) {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const loadTickets = async () => {
//     try {
//       setLoading(true);
//       const count = await contract.ticketCount();
//       const total = Number(count);
//       const list = [];

//       for (let i = 1; i <= total; i++) {
//         const result = await contract.validateTicket(i);
//         list.push({
//           id: i,
//           isValid: result[0],
//           eventName: result[1],
//           ownerName: result[2],
//         });
//       }

//       setTickets(list);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
//       <h2>📋 All Tickets</h2>
//       <button onClick={loadTickets} disabled={loading}>
//         {loading ? "Loading..." : "Refresh Tickets"}
//       </button>

//       {tickets.length > 0 && (
//         <table style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ background: "#eee" }}>
//               <th style={th}>ID</th>
//               <th style={th}>Event</th>
//               <th style={th}>Owner</th>
//               <th style={th}>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tickets.map((ticket) => (
//               <tr key={ticket.id}>
//                 <td style={td}>{ticket.id}</td>
//                 <td style={td}>{ticket.eventName}</td>
//                 <td style={td}>{ticket.ownerName}</td>
//                 <td style={td}>
//                   <span style={{
//                     background: ticket.isValid ? "green" : "red",
//                     color: "white",
//                     padding: "3px 10px",
//                     borderRadius: "20px",
//                     fontSize: "12px"
//                   }}>
//                     {ticket.isValid ? "✅ Valid" : "❌ Used"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {tickets.length === 0 && !loading && (
//         <p style={{ color: "gray", marginTop: "10px" }}>No tickets found. Click Refresh!</p>
//       )}
//     </div>
//   );
// }

// const th = { padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" };
// const td = { padding: "10px", borderBottom: "1px solid #ddd" };

// export default TicketList;



import { useState, useEffect } from "react";

export default function TicketList({ contract, onRefresh }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  async function loadTickets() {
    setLoading(true);
    try {
      const count = await contract.getTicketCount();
      const total = Number(count);
      setTotalCount(total);
      const loaded = [];
      // tickets mapping is 1-indexed (ticketId starts at 1)
      for (let i = 1; i <= total; i++) {
        try {
          const t = await contract.tickets(i);
          loaded.push({
            ticketId: t.ticketId.toString(),
            eventName: t.eventName,
            ownerName: t.ownerName,
            isValid: t.isValid,
          });
        } catch { /* skip bad index */ }
      }
      setTickets(loaded);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!contract) return;

    async function fetchTickets() {
      await loadTickets();
    }

    fetchTickets();
  }, [contract, onRefresh]);

  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm border border-cyan-400/40 bg-cyan-400/5 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest text-white uppercase">All Tickets</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{totalCount} ticket{totalCount !== 1 ? "s" : ""} on-chain</p>
          </div>
        </div>
        <button
          onClick={loadTickets}
          className="text-[10px] tracking-widest text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-sm hover:bg-cyan-400/5 transition-colors uppercase"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3">
          <svg className="w-5 h-5 animate-spin text-cyan-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs text-gray-500 tracking-widest uppercase">Fetching from chain...</span>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/5 rounded-sm">
          <svg className="w-8 h-8 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <p className="text-xs text-gray-600 tracking-wide">No tickets created yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.ticketId}
              className="flex items-center justify-between border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] rounded-sm px-4 py-3 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-600 border border-white/5 px-2 py-0.5 rounded-sm font-mono">
                  #{t.ticketId}
                </span>
                <div>
                  <p className="text-sm text-white font-medium">{t.eventName}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t.ownerName}</p>
                </div>
              </div>
              <span className={`text-[10px] tracking-widest uppercase border px-2 py-1 rounded-sm ${
                t.isValid
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                  : "border-amber-500/30 text-amber-400 bg-amber-500/5"
              }`}>
                {t.isValid ? "Valid" : "Used"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}