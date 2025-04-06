const { ethers } = require("ethers");

async function sendETH() {
    // Connect to your local Ethereum node
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // Use one of the pre-funded test accounts from Hardhat/Ganache
    const senderPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Replace with a test account private key
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);

    // Replace with your MetaMask address
    const recipientAddress = "WALLET ADDRESS";

    // Define transaction details
    const tx = {
        to: recipientAddress,
        value: ethers.utils.parseEther("100.0") // Sending 1 ETH
    };

    // Send transaction
    const txResponse = await senderWallet.sendTransaction(tx);
    console.log(`Transaction sent! TX Hash: ${txResponse.hash}`);

    // Wait for confirmation
    const receipt = await txResponse.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
}

// Run the function
sendETH();
