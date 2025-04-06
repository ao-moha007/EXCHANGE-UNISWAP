"use client"; // Ensures it runs only in the browser (Next.js App Router)

import { useState } from "react";
import { ethers } from "ethers";

export default function Swap() {
    const [status, setStatus] = useState("Waiting...");
    const [userAddress, setUserAddress] = useState(null);

    async function swapWethToUsdc() {
        try {
            setStatus("Connecting to MetaMask...");

            // Connect to MetaMask
            if (!window.ethereum) throw new Error("MetaMask is not installed");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setUserAddress(address);
            setStatus(`Connected as ${address}`);

            // Contract addresses
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
            const UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

            // ERC20 ABI (Minimal)
            const ERC20_ABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function approve(address spender, uint256 amount) returns (bool)"
            ];

            const weth = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, signer);
            const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);

            const SWAP_ROUTER_ABI = [
                "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)"
            ];

            const uniswapRouter = new ethers.Contract(UNISWAP_V3_ROUTER, SWAP_ROUTER_ABI, signer);

            // Amount to swap
            const amountIn = ethers.utils.parseUnits("1", 18); // 1 WETH

            // Approve Uniswap V3 Router to spend WETH
            setStatus("Approving WETH...");
            const approvalTx = await weth.approve(UNISWAP_V3_ROUTER, amountIn);
            await approvalTx.wait();
            setStatus("WETH Approved!");

            // Swap parameters
            const params = {
                tokenIn: WETH_ADDRESS,
                tokenOut: USDC_ADDRESS,
                fee: 3000, // 0.3% Uniswap V3 Pool Fee
                recipient: address,
                deadline: Math.floor(Date.now() / 1000) + 60 * 10,
                amountIn: amountIn,
                amountOutMinimum: 0, // No slippage protection
                sqrtPriceLimitX96: 0,
            };

            // Execute the swap
            setStatus("Swapping WETH for USDC...");
            const tx = await uniswapRouter.exactInputSingle(params);
            await tx.wait();
            setStatus("Swap Successful!");

            // Check USDC balance
            const usdcBalance = await usdc.balanceOf(address);
            alert(`USDC Balance: ${ethers.utils.formatUnits(usdcBalance, 6)}`);

        } catch (error) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        }
    }

    return (
        <div>
            <h2>Uniswap Swap (WETH to USDC)</h2>
            <button onClick={swapWethToUsdc}>Swap 1 WETH for USDC</button>
            <p>Status: {status}</p>
            {userAddress && <p>Your Address: {userAddress}</p>}
        </div>
    );
}
