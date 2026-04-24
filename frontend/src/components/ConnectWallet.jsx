function ConnectWallet({ onConnect }) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎫 Event Ticket Verification</h1>
      <p>Connect your wallet to continue</p>
      <button onClick={onConnect}>Connect MetaMask</button>
    </div>
  );
}

export default ConnectWallet;