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
import { CONTRACT_ADDRESS, CONTRACT_ABI,ORGANIZER_ADDRESS } from '../contract';

export default function QRScanner() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);

  async function checkTicket(ticketId) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const res = await contract.tickets(ticketId);
      const eventDetails = await contract.events(res.eventId);

      if (res.ownerAddress === "0x0000000000000000000000000000000000000000") {
        alert("Invalid Ticket ID!");
        setScannerActive(true);
      } else {
        setData({ 
          valid: res.isValid, 
          name: res.ownerName,
          id: res.ticketId.toString(),
          eventName: eventDetails.name,
          venue: eventDetails.venue
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render((decodedText) => {
      const ticketId = decodedText.trim();
      setId(ticketId);
      scanner.clear();
      setScannerActive(false);
      checkTicket(ticketId);
    }, () => {});
  };

  useEffect(() => {
    if (scannerActive) startScanner();
    return () => {
      try { 
        new Html5QrcodeScanner('reader').clear(); 
      } catch {
        // Ignore if already cleared
      }
    };
  }, [scannerActive]);

  const grantEntry = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Check local address vs expected organizer address
    console.log("Current Signer:", signer.address);
    console.log("Expected Organizer:", ORGANIZER_ADDRESS);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.verifyAndUseTicket(id);
    await tx.wait();
    alert("ENTRY GRANTED!");
    setData(null); setId(""); setScannerActive(true);
  } catch (err) {
    // CHANGE THIS: Show the actual error
    console.error(err);
    alert(`Verification failed: ${err.reason || err.message}`);
  }
};

  return (
    <div className="max-w-md mx-auto space-y-6">
      {scannerActive ? (
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
          <div id="reader" className="w-full rounded-2xl overflow-hidden"></div>
          <p className="text-center py-6 text-white/40 font-bold uppercase tracking-widest text-[10px]">
            Align QR Code within frame
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-in zoom-in duration-300">
          <button 
            onClick={() => { setData(null); setScannerActive(true); }} 
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl border border-white/10 transition-all font-bold text-xs uppercase tracking-widest"
          >
            ← Cancel Scan
          </button>

          {data && (
            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] relative overflow-hidden">
               {/* Background Glow */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[80px] ${data.valid ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}></div>
              
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Ticket Holder</p>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{data.name}</h2>
                </div>

                <div className="space-y-2">
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Event Info</p>
                  <p className="text-amber-500 font-bold">{data.eventName}</p>
                  <p className="text-white/60 text-sm italic">📍 {data.venue}</p>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-[10px] tracking-widest ${data.valid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${data.valid ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                  {data.valid ? "VALID PASS" : "ALREADY USED"}
                </div>

                {data.valid && (
                  <button 
                    onClick={grantEntry} 
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 uppercase tracking-widest"
                  >
                    Confirm Entry
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}