// function ConnectWallet({ onConnect }) {
//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h1>🎫 Event Ticket Verification</h1>
//       <p>Connect your wallet to continue</p>
//       <button onClick={onConnect}>Connect MetaMask</button>
//     </div>
//   );
// }

// export default ConnectWallet;


export default function ConnectWallet({ onConnect }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Logo mark */}
      <div className="relative mb-12">
        <div className="w-24 h-24 rounded-2xl border border-cyan-400/30 bg-cyan-400/5 flex items-center justify-center mx-auto mb-0 relative z-10">
          <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        {/* Glow */}
        <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-cyan-400/10 blur-xl" />
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 text-white">
        Ticket<span className="text-cyan-400">Chain</span>
      </h1>
      <p className="text-sm tracking-[0.3em] text-gray-500 uppercase mb-6">
        Blockchain Event Verification
      </p>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10 w-full max-w-xs">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[10px] tracking-widest text-gray-600 uppercase">Sepolia Testnet</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Feature chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-12 max-w-sm">
        {["NFT Tickets", "QR Verify", "Anti-Fraud", "On-Chain"].map((f) => (
          <span key={f} className="text-[11px] tracking-widest text-gray-400 border border-white/10 bg-white/[0.02] px-3 py-1.5 rounded-sm uppercase">
            {f}
          </span>
        ))}
      </div>

      {/* Connect button */}
      <button
        onClick={onConnect}
        className="group relative px-10 py-4 bg-cyan-400 text-gray-950 text-sm font-bold tracking-[0.15em] uppercase rounded-sm hover:bg-cyan-300 transition-all duration-200 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-3">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z" />
          </svg>
          Connect MetaMask
        </span>
      </button>

      <p className="mt-5 text-xs text-gray-600 tracking-wide">
        Make sure you're on the <span className="text-cyan-400/70">Sepolia</span> testnet
      </p>

      {/* Bottom stats */}
      <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-sm">
        {[
          { label: "Network", value: "Sepolia" },
          { label: "Standard", value: "ERC-721" },
          { label: "Verified", value: "On-Chain" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-base font-bold text-white">{s.value}</div>
            <div className="text-[10px] tracking-widest text-gray-600 uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}