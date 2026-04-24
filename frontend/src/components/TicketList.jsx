import { useState } from "react";

function TicketList({ contract }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const count = await contract.ticketCount();
      const total = Number(count);
      const list = [];

      for (let i = 1; i <= total; i++) {
        const result = await contract.validateTicket(i);
        list.push({
          id: i,
          isValid: result[0],
          eventName: result[1],
          ownerName: result[2],
        });
      }

      setTickets(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
      <h2>📋 All Tickets</h2>
      <button onClick={loadTickets} disabled={loading}>
        {loading ? "Loading..." : "Refresh Tickets"}
      </button>

      {tickets.length > 0 && (
        <table style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={th}>ID</th>
              <th style={th}>Event</th>
              <th style={th}>Owner</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td style={td}>{ticket.id}</td>
                <td style={td}>{ticket.eventName}</td>
                <td style={td}>{ticket.ownerName}</td>
                <td style={td}>
                  <span style={{
                    background: ticket.isValid ? "green" : "red",
                    color: "white",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {ticket.isValid ? "✅ Valid" : "❌ Used"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tickets.length === 0 && !loading && (
        <p style={{ color: "gray", marginTop: "10px" }}>No tickets found. Click Refresh!</p>
      )}
    </div>
  );
}

const th = { padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" };
const td = { padding: "10px", borderBottom: "1px solid #ddd" };

export default TicketList;