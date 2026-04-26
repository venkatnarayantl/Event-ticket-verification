// import { useState, useEffect } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";

// function QRScanner({ contract }) {
//   const [scanning, setScanning] = useState(false);
//   const [result, setResult] = useState("");
//   const [scanner, setScanner] = useState(null);

//   useEffect(() => {
//     return () => {
//       if (scanner) {
//         scanner.clear().catch(() => {});
//       }
//     };
//   }, [scanner]);

//   const startScan = () => {
//     setScanning(true);
//     setResult("");

//     const qrScanner = new Html5QrcodeScanner("qr-reader", {
//       fps: 10,
//       qrbox: { width: 250, height: 250 },
//     });

//     qrScanner.render(
//       async (decodedText) => {
//         // Stop scanning after first successful scan
//         await qrScanner.clear();
//         setScanning(false);

//         const ticketId = decodedText.trim();
//         setResult(`🔍 Scanned Ticket ID: ${ticketId} — Verifying...`);

//         try {
//           // Auto verify
//           const verified = await contract.validateTicket(ticketId);
//           const isValid = verified[0];
//           const eventName = verified[1];
//           const ownerName = verified[2];

//           if (!isValid) {
//             setResult(`❌ INVALID or ALREADY USED TICKET (ID: ${ticketId})`);
//             return;
//           }

//           // Auto mark as used
//           setResult(`✅ Valid! Marking as used...`);
//           const tx = await contract.useTicket(ticketId);
//           await tx.wait();

//           setResult(
//             `✅ ENTRY GRANTED! | Event: ${eventName} | Owner: ${ownerName} | Ticket #${ticketId} marked as used!`
//           );

//         } catch (err) {
//           setResult("❌ Error: " + err.message);
//         }
//       },
//       (error) => {
//         // Ignore scan errors
//         console.warn(error);
//       }
//     );

//     setScanner(qrScanner);
//   };

//   const stopScan = async () => {
//     if (scanner) {
//       await scanner.clear().catch(() => {});
//       setScanner(null);
//     }
//     setScanning(false);
//   };

//   return (
//     <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
//       <h2>📷 Scan & Verify Ticket</h2>
//       <p style={{ color: "gray", fontSize: "14px" }}>
//         Scan a ticket QR code — it will auto verify and mark as used!
//       </p>

//       {!scanning ? (
//         <button onClick={startScan}>Start Camera Scan</button>
//       ) : (
//         <button onClick={stopScan} style={{ background: "red", color: "white" }}>
//           Stop Scan
//         </button>
//       )}

//       <div id="qr-reader" style={{ marginTop: "15px" }}></div>

//       {result && (
//         <p style={{
//           marginTop: "15px",
//           fontWeight: "bold",
//           color: result.includes("✅") ? "green" : "red"
//         }}>
//           {result}
//         </p>
//       )}
//     </div>
//   );
// }

// export default QRScanner;


import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';

export default function QRScanner() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    // This creates the scanner. It will ask for camera permission on mount.
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText) {
      // Assuming the QR code value is just the Ticket ID number
      const ticketId = decodedText.trim();
      setId(ticketId);
      scanner.clear(); // Stop scanning once a code is found
      setScannerActive(false);
      checkTicket(ticketId);
    }

    function onScanError(error) {
      // Ignore scan errors
      console.warn(error);
    }


    return () => scanner.clear(); // Cleanup when component closes
  }, []);

  async function checkTicket(ticketId) {
    if (!ticketId) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const res = await contract.tickets(ticketId); 

      if (res.ownerAddress === "0x0000000000000000000000000000000000000000") {
        alert("Invalid Ticket ID!");
      } else {
        setData({ 
          valid: res.isValid, 
          name: res.ownerName,
          id: res.ticketId.toString()
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching ticket details.");
    }
  };

  // Run the check automatically if the scanner finds an ID
  useEffect(() => {
    if (id && !scannerActive) {
      checkTicket();
    }
  }, [id, scannerActive]);

  const grantEntry = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.verifyAndUseTicket(id);
      await tx.wait();
      alert("ENTRY GRANTED!");
      window.location.reload(); // Quick way to reset the scanner for the next person
    } catch{
      alert("Failed to verify. Are you the organizer?");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {scannerActive ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          <div id="reader" className="w-full"></div>
          <p className="text-center py-4 text-white/40">Align QR code within the frame</p>
        </div>
      ) : (
        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-2 bg-white/10 text-white rounded-lg mb-4"
        >
          ← Reset Scanner
        </button>
      )}

      {data && (
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl animate-in zoom-in duration-300">
          <p className="text-white/40 text-sm">Ticket Holder</p>
          <h2 className="text-3xl font-bold text-white mb-4">{data.name}</h2>
          
          <div className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${data.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {data.valid ? "✓ VALID TICKET" : "✗ ALREADY USED"}
          </div>

          {data.valid && (
            <button 
              onClick={grantEntry} 
              className="w-full mt-8 py-4 bg-emerald-500 text-black font-bold rounded-xl"
            >
              GRANT ENTRY
            </button>
          )}
        </div>
      )}
    </div>
  );
}