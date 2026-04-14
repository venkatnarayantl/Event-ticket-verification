const hardhat = require("hardhat");

async function main(){
    console.log("Deploying the contract...");
    //get the contract factory
    const TicketNFT = await hardhat.ethers.getContractFactory("TicketNFT");

    //deploy the contract
    const ticketNFT = await TicketNFT.deploy();

    //wait for deployment to complete
    await ticketNFT.waitForDeployment();

    // Print the contract address
    console.log("TicketNFT deployed to:", await ticketNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});