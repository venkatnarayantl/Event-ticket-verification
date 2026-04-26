// import { useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";

// function GenerateTicket({ contract }) {
//   const [eventName, setEventName] = useState("");
//   const [ownerName, setOwnerName] = useState("");
//   const [status, setStatus] = useState("");
//   const [ticketId, setTicketId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const generateTicket = async () => {
//     if (!eventName || !ownerName) {
//       alert("Please fill in both fields!");
//       return;
//     }

//     try {
//       setLoading(true);
//       setStatus("Creating ticket on blockchain...");
//       setTicketId(null);

//       const tx = await contract.createTicket(eventName, ownerName);
//       const receipt = await tx.wait();

//       // Get ticket ID from event logs
//       const event = receipt.logs.find(log => {
//         try {
//           return contract.interface.parseLog(log).name === "TicketCreated";
//         } catch { return false; }
//       });

//       const parsed = contract.interface.parseLog(event);
//       const id = parsed.args[0].toString();

//       setTicketId(id);
//       setStatus(`✅ Ticket Created! ID: ${id}`);
//       setEventName("");
//       setOwnerName("");

//     } catch (err) {
//       setStatus("❌ Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
//       <h2>🎟️ Generate New Ticket</h2>
//       <input
//         type="text"
//         placeholder="Event Name"
//         value={eventName}
//         onChange={(e) => setEventName(e.target.value)}
//         style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px" }}
//       />
//       <input
//         type="text"
//         placeholder="Attendee Name"
//         value={ownerName}
//         onChange={(e) => setOwnerName(e.target.value)}
//         style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px" }}
//       />
//       <button onClick={generateTicket} disabled={loading}>
//         {loading ? "Generating..." : "Generate Ticket"}
//       </button>

//       {status && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{status}</p>}

//       {ticketId && (
//         <div style={{ marginTop: "20px", textAlign: "center" }}>
//           <p><strong>Ticket ID: {ticketId}</strong></p>
//           <QRCodeCanvas value={ticketId} size={180} />
//           <p style={{ fontSize: "12px", color: "gray" }}>
//             Scan this QR at the event entry!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GenerateTicket;


import { useState } from "react";

export default function GenerateTicket({ contract, onSuccess }) {
  const [form, setForm] = useState({ eventName: "", ownerName: "" });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const tx = await contract.createTicket(form.eventName, form.ownerName);
      setTxHash(tx.hash);
      await tx.wait();
      setStatus("success");
      setForm({ eventName: "", ownerName: "" });
      onSuccess?.();
    } catch (err) {
      setError(err.reason || err.message || "Transaction failed");
      setStatus("error");
    }
  }

  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-sm border border-amber-400/40 bg-amber-400/5 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-widest text-white uppercase">Create Ticket</h3>
          <p className="text-[11px] text-gray-500 tracking-wide mt-0.5">Mint a new ticket on-chain</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] tracking-widest text-gray-500 uppercase mb-2">Event Name</label>
          <input
            type="text"
            value={form.eventName}
            onChange={(e) => setForm({ ...form, eventName: e.target.value })}
            placeholder="e.g. ETHIndia 2025"
            required
            className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/40 focus:bg-white/[0.05] transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] tracking-widest text-gray-500 uppercase mb-2">Attendee Name</label>
          <input
            type="text"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            placeholder="e.g. Venkat Narayan"
            required
            className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/40 focus:bg-white/[0.05] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full mt-2 py-3 bg-amber-400 text-gray-950 text-xs font-bold tracking-[0.15em] uppercase rounded-sm hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending Transaction...
            </span>
          ) : "Create Ticket"}
        </button>
      </form>

      {status === "success" && (
        <div className="mt-4 border border-emerald-500/30 bg-emerald-500/5 rounded-sm px-4 py-3">
          <p className="text-xs text-emerald-400 font-bold tracking-wide mb-1">✓ Ticket Created Successfully</p>
          {txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-400/60 hover:text-emerald-400 underline underline-offset-2 transition-colors"
            >
              View on Etherscan ↗
            </a>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 border border-red-500/30 bg-red-500/5 rounded-sm px-4 py-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}