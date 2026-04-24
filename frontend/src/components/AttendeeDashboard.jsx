import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Import the QR component

function AttendeeDashboard({ contract, account }) {
  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [status, setStatus] = useState("");

  const verifyAndShowQR = async () => {
    if (!ticketId) { alert("Enter a ticket ID!"); return; }

    try {
      setStatus("Fetching ticket details...");
      setTicketData(null); // Reset previous QR
      
      const result = await contract.validateTicket(ticketId);
      const isValid = result[0];
      const eventName = result[1];
      const ownerName = result[2];

      if (isValid) {
        setStatus("✅ Ticket Valid! Show this QR at the entrance.");
        setTicketData({ id: ticketId, event: eventName, owner: ownerName });
      } else {
        setStatus("❌ This Ticket ID is INVALID or has ALREADY BEEN USED.");
      }
    } catch (err) {
      setStatus("❌ Error: Ticket ID not found or contract error.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🎫 My Ticket Portal</h1>
        <span style={{ fontSize: "12px", color: "gray" }}>{account.slice(0, 6)}...{account.slice(-4)}</span>
      </div>

      <hr />

      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
        <h3>Enter Ticket ID to Generate QR</h3>
        <input
          type="number"
          placeholder="e.g. 1"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          style={{ padding: "10px", width: "80%", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <br />
        <button onClick={verifyAndShowQR} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Get My QR Code
        </button>

        {status && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{status}</p>}

        {ticketData && (
          <div style={{ marginTop: "20px", padding: "20px", background: "white", borderRadius: "10px", display: "inline-block" }}>
            <QRCodeCanvas value={ticketData.id.toString()} size={200} />
            <div style={{ marginTop: "10px", textAlign: "left" }}>
              <p><strong>Event:</strong> {ticketData.event}</p>
              <p><strong>Owner:</strong> {ticketData.owner}</p>
              <p><strong>ID:</strong> #{ticketData.id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendeeDashboard;