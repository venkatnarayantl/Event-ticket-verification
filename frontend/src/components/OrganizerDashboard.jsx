import GenerateTicket from "./GenerateTicket";
import TicketList from "./TicketList";
import QRScanner from "./QRScanner";

function OrganizerDashboard({ contract, account }) {
  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🎫 Organizer Dashboard</h1>
        <div>
          <span style={{ fontSize: "12px", color: "gray" }}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <span style={{
            marginLeft: "10px",
            background: "green",
            color: "white",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px"
          }}>
            Organizer
          </span>
        </div>
      </div>

      <hr />
      <GenerateTicket contract={contract} />
      <hr />
      <TicketList contract={contract} />
      <hr />
      <QRScanner contract={contract} />
    </div>
  );
}

export default OrganizerDashboard;