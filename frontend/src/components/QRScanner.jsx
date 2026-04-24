import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ contract }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [scanner]);

  const startScan = () => {
    setScanning(true);
    setResult("");

    const qrScanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    qrScanner.render(
      async (decodedText) => {
        // Stop scanning after first successful scan
        await qrScanner.clear();
        setScanning(false);

        const ticketId = decodedText.trim();
        setResult(`🔍 Scanned Ticket ID: ${ticketId} — Verifying...`);

        try {
          // Auto verify
          const verified = await contract.validateTicket(ticketId);
          const isValid = verified[0];
          const eventName = verified[1];
          const ownerName = verified[2];

          if (!isValid) {
            setResult(`❌ INVALID or ALREADY USED TICKET (ID: ${ticketId})`);
            return;
          }

          // Auto mark as used
          setResult(`✅ Valid! Marking as used...`);
          const tx = await contract.useTicket(ticketId);
          await tx.wait();

          setResult(
            `✅ ENTRY GRANTED! | Event: ${eventName} | Owner: ${ownerName} | Ticket #${ticketId} marked as used!`
          );

        } catch (err) {
          setResult("❌ Error: " + err.message);
        }
      },
      (error) => {
        // Ignore scan errors
        console.warn(error);
      }
    );

    setScanner(qrScanner);
  };

  const stopScan = async () => {
    if (scanner) {
      await scanner.clear().catch(() => {});
      setScanner(null);
    }
    setScanning(false);
  };

  return (
    <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
      <h2>📷 Scan & Verify Ticket</h2>
      <p style={{ color: "gray", fontSize: "14px" }}>
        Scan a ticket QR code — it will auto verify and mark as used!
      </p>

      {!scanning ? (
        <button onClick={startScan}>Start Camera Scan</button>
      ) : (
        <button onClick={stopScan} style={{ background: "red", color: "white" }}>
          Stop Scan
        </button>
      )}

      <div id="qr-reader" style={{ marginTop: "15px" }}></div>

      {result && (
        <p style={{
          marginTop: "15px",
          fontWeight: "bold",
          color: result.includes("✅") ? "green" : "red"
        }}>
          {result}
        </p>
      )}
    </div>
  );
}

export default QRScanner;