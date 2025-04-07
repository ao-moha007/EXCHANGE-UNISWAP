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
    const { ethers } = require("hardhat");

    // Address of WETH token on Ethereum mainnet
    const WETH_ADDRESS = ethers.utils.getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
    
    /**
     * Minimal ABI for WETH contract interactions
     * @constant
     * @type {string[]}
     */
    const WETH_ABI = [
        "function deposit() public payable",
        "function withdraw(uint256 wad) public",
        "function balanceOf(address owner) external view returns (uint256)",
        "function transfer(address to, uint amount) public returns (bool)",
    ];
    
    /**
     * Main function to deposit ETH into WETH and transfer WETH to a recipient.
     * This is typically used in a Hardhat local fork of mainnet for testing purposes.
     * 
     * @async
     * @function
     */
    async function main() {
        // Get default signer from Hardhat (unlocked account on forked mainnet)
        const [deployer] = await ethers.getSigners();
        console.log("Using existing WETH at:", WETH_ADDRESS);
    
        /**
         * WETH contract instance connected to deployer
         * @type {ethers.Contract}
         */
        const weth = new ethers.Contract(WETH_ADDRESS, WETH_ABI, deployer);
    
        // Deposit ETH into WETH
        console.log("Depositing ETH into WETH...");
        const tx = await weth.deposit({ value: ethers.utils.parseEther("100.0") });
        await tx.wait();
    
        // Log deployer's WETH balance
        const balance = await weth.balanceOf(deployer.address);
        console.log("WETH balance after deposit:", ethers.utils.formatEther(balance));
    
        // Setup new signer using private key (Hardhat test account #0)
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    
        /**
         * Impersonated wallet with ETH/WETH to send funds to recipient
         * ⚠️ DO NOT use real private keys in production scripts
         * @type {ethers.Wallet}
         */
        const deployerM = new ethers.Wallet(
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            provider
        );
    
        /**
         * MetaMask wallet or any recipient address you want to fund
         * @type {string}
         */
        const recipient = "WALLET ADDRESS"; // <-- replace this with your actual address
    
        // Create a contract instance from the impersonated wallet
        const wethM = new ethers.Contract(WETH_ADDRESS, WETH_ABI, deployerM);
    
        // Define amount to transfer
        const amount = ethers.utils.parseEther("20");
    
        // Transfer WETH to the recipient
        const txToMeta = await wethM.transfer(recipient, amount);
        await txToMeta.wait();
    
        // Optional: check WETH balance after transfer
        const deployerCheckAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        const remaining = await weth.balanceOf(deployerCheckAddress);
        console.log("WETH balance after transfer:", ethers.utils.formatEther(remaining));
    }
    
    // Run the main function and handle errors
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
    
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
    //console.log(` Sent 3 WETH to ${recipient}`);
    console.log("WETH balance after transfer :", await weth.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
