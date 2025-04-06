const { ethers } = require("hardhat");

const WETH_ADDRESS = ethers.utils.getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
const WETH_ABI = [
    "function deposit() public payable",
    "function withdraw(uint256 wad) public",
    "function balanceOf(address owner) external view returns (uint256)",
    "function transfer(address to, uint amount) public returns (bool)",
];

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Using existing WETH at:", WETH_ADDRESS);

    const weth = new ethers.Contract(WETH_ADDRESS, WETH_ABI, deployer);

    console.log("Depositing ETH into WETH...");
    const tx = await weth.deposit({ value: ethers.utils.parseEther("100.0") });
    await tx.wait();
    console.log("WETH balance after deposit:", await weth.balanceOf(deployer.address));

    // Replace with your Hardhat provider
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // Deployer (default Hardhat account)
    const deployerM = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

    // Your MetaMask Address
    const recipient = "WALLET ADDRESS";
    
    // Create WETH contract instance
    const wethM = new ethers.Contract(WETH_ADDRESS, WETH_ABI, deployerM);
    const amount = ethers.utils.parseEther("20"); // 3 WETH
    const txToMeta = await wethM.transfer(recipient, amount);
    await txToMeta.wait();
    //console.log(`✅ Sent 3 WETH to ${recipient}`);
    console.log("WETH balance after transfer :", await weth.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
