import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function GenerateTicket({ contract }) {
  const [eventName, setEventName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [status, setStatus] = useState("");
  const [ticketId, setTicketId] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTicket = async () => {
    if (!eventName || !ownerName) {
      alert("Please fill in both fields!");
      return;
    }

    try {
      setLoading(true);
      setStatus("Creating ticket on blockchain...");
      setTicketId(null);

      const tx = await contract.createTicket(eventName, ownerName);
      const receipt = await tx.wait();

      // Get ticket ID from event logs
      const event = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log).name === "TicketCreated";
        } catch { return false; }
      });

      const parsed = contract.interface.parseLog(event);
      const id = parsed.args[0].toString();

      setTicketId(id);
      setStatus(`✅ Ticket Created! ID: ${id}`);
      setEventName("");
      setOwnerName("");

    } catch (err) {
      setStatus("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
      <h2>🎟️ Generate New Ticket</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <input
        type="text"
        placeholder="Attendee Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button onClick={generateTicket} disabled={loading}>
        {loading ? "Generating..." : "Generate Ticket"}
      </button>

      {status && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{status}</p>}

      {ticketId && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p><strong>Ticket ID: {ticketId}</strong></p>
          <QRCodeCanvas value={ticketId} size={180} />
          <p style={{ fontSize: "12px", color: "gray" }}>
            Scan this QR at the event entry!
          </p>
        </div>
      )}
    </div>
  );
}

export default GenerateTicket;