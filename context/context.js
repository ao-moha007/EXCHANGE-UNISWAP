import React, { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import JSBI from "jsbi";
import Web3Modal from "web3modal";
import fs from "fs";
if (typeof window === 'undefined') {
    // This code will run only on the server-side
    const fs = require('fs');
    console.log("fs:", fs)
};
//INTERNAL IMPORT Uniswap
import { SwapRouter } from "@uniswap/universal-router-sdk";
import {
    TradeType,
    Ether,
    Token,
    CurrencyAmount,
    Percent,

} from "@uniswap/sdk-core";
import { Trade as V2Trade } from "@uniswap/v2-sdk";
import {
    Pool,
    nearestUsableTick,
    TickMath,
    TICK_SPACINGS,
    FeeAmount,
    Trade as V3Trade,
    Route as RouteV3,

} from "@uniswap/v3-sdk";

import { MixedRouteTrade, Trade as RouterTrade } from "@uniswap/router-sdk";
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";

//INTERNAL IMPORT
import { ERC20_ABI, web3Provider, CONNECTING_CONTRACT } from "./constants";
import { shortenAddress, parseErrorMsg } from "../utils/index";
import { loadComponents } from "next/dist/server/load-components";

export const CONTEXT = React.createContext();

export const PROVIDER = ({ children }) => {
    const TOKEN_SWAP = "TOKEN SWAP DAPP ";
    const [loader, setLoader] = useState(false);
    const [address, setAddress] = useState("");
    const [chainID, setChainID] = useState();

    //NOTIFICATION
    const notifyError = (msg) => toast.error(msg, { duration: 4000 });
    const notifySuccess = (msg) => toast.error(msg, { duration: 4000 });

    //CONNECT WALLET FUNCTION
    const connect = async () => {
        try {
            if (!window.ethereum) return notifyError("Install MetaMask");

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if (accounts.length) {
                setAddress(accounts[0]);
            } else {
                notifyError("Sorry, you have no account");
            }

            const provider = await web3Provider();
            const network = await provider.getNetwork();
            setChainID(network.chainId);
        } catch (error) {
            const errorMsg = parseErrorMsg(error);
            notifyError(errorMsg);
            console.log(error);
        };
    };

    //LOAD TOKEN DATA
    const LOAD_TOKEN = async (token) => {
        try {
            const tokenDetail = await CONNECTING_CONTRACT(token);
            return tokenDetail;
        } catch (error) {
            const errorMsg = parseErrorMsg(error);
            notifyError(errorMsg);
            console.log(error);
        }
    };

    //INTERNAL FUNCTION
    async function getPool(tokenA, tokenB, feeAmount, provider) {
        const [token0, token1] = tokenA.sortsBefore(tokenB)
            ? [tokenA, tokenB]
            : [tokenB, tokenA];

        const poolAddress = Pool.getAddress(token0, token1, feeAmount);

        const contract = new ethers.Contract(poolAddress, IUniswapV3Pool.abi, provider);
        let liquidity = await contract.liquidity();
        let { sqrtPriceX96, tick } = await contract.slot0();
        
        liquidity = JSBI.BigInt(liquidity.toString());
        sqrtPriceX96 = JSBI.BigInt(sqrtPriceX96.toString());
        console.log("tick typeof:", typeof tick, tick);
        console.log(liquidity instanceof JSBI); // should be true

        tick = Number(tick);
        console.log("tick typeof:", typeof tick, tick);
        const tickLower = nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]);
        const tickUpper = nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]);

        console.log("CALLING_POOL--------------");
        return new Pool(token0, token1, feeAmount, sqrtPriceX96, liquidity, tick, [
            {
                index: tickLower,//nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
                liquidityNet: liquidity,
                liquidityGross: liquidity
            },

            {
                index: tickUpper,//nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
                liquidityNet: JSBI.multiply(liquidity, JSBI.BigInt("-1")),
                liquidityGross: liquidity
            },

        ]);
    }

    //SWAP_OPTION FUNCTION INTERNAL
    function swapOptions(options,userAddress) {
        return Object.assign({
            slippageTolerance: new Percent(5, 1000),
            recipient: userAddress,
        },
            options,
        );
    }


    //BUILDTRADE
    function buildTrade(trades) {
        // Log trade details for debugging
        console.log("Trades:", trades);
        trades.forEach(trade => {

            console.log("Trade route:", trade.route);
            console.log("Pools in route:", trade.route.pools);
            console.log("Token path:", trade.route.tokenPath);
            console.log("Mid price:", trade.route.midPrice?.toSignificant(6));
            console.log("Trade swaps:", trade.swaps);
            console.log("Trade type:", trade.tradeType);

        });

        try {
            // Ensure uniqueness of pools
            const seenPools = new Set();

        } catch (error) {
            console.error("trades error:", error);
        }




        return new RouterTrade({
            v2Routes: trades
                .filter((trade) => trade instanceof V2Trade)
                .map((trade) => ({
                    routev2: trade.route,
                    inputAmount: trade.inputAmount,
                    outputAmount: trade.outputAmount,

                })),
            v3Routes: trades
                .filter((trade) => trade instanceof V3Trade)
                .map((trade) => ({
                    routev3: trade.route,
                    inputAmount: trade.inputAmount,
                    outputAmount: trade.outputAmount,

                })),
            mixedRoutes: trades
                .filter((trade) => trade instanceof MixedRouteTrade)
                .map((trade) => ({
                    mixedRoute: trade.route,
                    inputAmount: trade.inputAmount,
                    outputAmount: trade.outputAmount,

                })),
            tradeType: trades[0].tradeType,

        })
    }

    //DEMO ACCOUNT
    const RECIPIENT = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

    //SWAP 
    const swap = async (token_1, token_2,swapInputAmount) => {
        try {

            // Connect to MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
            const ETHER = Ether.onChain(token_1.chainId);
                //TOKEN CONTRACT
            const tokenAddress1 = await CONNECTING_CONTRACT(token_1.address);
            const tokenAddress2 = await CONNECTING_CONTRACT(token_2.address);

            //     //TOKEN DETAILS
            const TOKEN_A = new Token(
                tokenAddress1.chainId,
                tokenAddress1.address,
                tokenAddress1.decimals,
                tokenAddress1.symbol,
                tokenAddress1.name,

            );

            const TOKEN_B = new Token(
                tokenAddress2.chainId,
                tokenAddress2.address,
                tokenAddress2.decimals,
                tokenAddress2.symbol,
                tokenAddress2.name,

            );
        

            //POOL ROUTE TRADE 
            const WETH_USDC_V3 = await getPool(
                            TOKEN_A,
                            TOKEN_B,
                            FeeAmount.MEDIUM,
                            provider
                        );
                        const poolAddress = Pool.getAddress(TOKEN_A, TOKEN_B, FeeAmount.MEDIUM);
                        console.log("poolAddress :", poolAddress);
                        console.log("WETH_USDC_V3 :", WETH_USDC_V3);
                        const inputEther = ethers.utils.parseEther(swapInputAmount).toString();
                        console.log("inputEther :", inputEther);
                        const trade = await V3Trade.fromRoute(
                            new RouteV3([WETH_USDC_V3], ETHER, TOKEN_B),
                            CurrencyAmount.fromRawAmount(ETHER, inputEther),
                            TradeType.EXACT_INPUT
                        );
                       
                        const routerTrade = buildTrade([trade]);
            
                        const opts = swapOptions({},userAddress);
            
                        const paramsTx = SwapRouter.swapCallParameters(routerTrade, opts);
                        
                        console.log("paramsTx : ",paramsTx);
                        console.log("paramsTx calldata :",paramsTx.calldata);
                        console.log("paramsTx value :",paramsTx.value);
                        
                        
            

        
        
       

        // Contract addresses
        const WETH_ADDRESS = tokenAddress1.address;
        const USDC_ADDRESS = tokenAddress2.address;
        const UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
        
        // ERC20 ABI (Minimal)
        const ERC20_ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function approve(address spender, uint256 amount) returns (bool)"
        ];

        const weth = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, signer);
        const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);

        const SWAP_ROUTER_ABI = [
            "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
            
        ];

        const uniswapRouter = new ethers.Contract(UNISWAP_V3_ROUTER, SWAP_ROUTER_ABI, signer);

        // Amount to swap
        const amountIn = ethers.utils.parseUnits(swapInputAmount, 18); // 1 WETH
        console.log("amountIn", amountIn.toString());
        const amountOutMinimum = ethers.utils.parseUnits("0.98", 6); // Assuming 1 WETH = 1 USDC (slippage accounted)
  
        // Approve Uniswap V3 Router to spend WETH
        
        ////////////////////////////////////////////////////////////////////
        // Approve the contract to spend WETH
        const approval = await weth.approve(UNISWAP_V3_ROUTER, inputEther);
        await approval.wait();
        console.log("userAddress : ", userAddress);
        

        // Swap parameters
        const params = {
            tokenIn: WETH_ADDRESS,
            tokenOut: USDC_ADDRESS,
            fee: 3000, // 0.3% Uniswap V3 Pool Fee
            recipient: userAddress,
            deadline: Math.floor(Date.now() / 1000) + 60 * 10,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum, //  slippage protection
            sqrtPriceLimitX96: 0,
        };

         
         // Prepare the calldata for the swap
            const calldata = uniswapRouter.interface.encodeFunctionData("exactInputSingle", [
                
                {
                    tokenIn: params.tokenIn,               // Input token
                    tokenOut: params.tokenOut,             // Output token
                    fee: params.fee,                       // Fee tier (e.g., 3000 for 0.3%)
                    recipient: params.recipient,           // Address receiving the output
                    deadline: params.deadline,             // Transaction deadline
                    amountIn: params.amountIn,             // Exact input amount
                    amountOutMinimum: params.amountOutMinimum, // Minimum output (slippage control)
                    sqrtPriceLimitX96: params.sqrtPriceLimitX96 // No price limit, set to 0
                
            }
            ]);
        // Execute the swap
        const tx = await signer.sendTransaction({
            data: calldata,
            to: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            from: userAddress,//RECIPIENT,
            gasLimit: ethers.utils.parseUnits("300000", "wei"),
        });
        
        await tx.wait();
        

        // Check USDC balance
        const usdcBalance = await usdc.balanceOf(userAddress);
        alert("USDC Balance: " + ethers.utils.formatUnits(usdcBalance, 6));
        console.log("USDC Balance: " + ethers.utils.formatUnits(usdcBalance, 6));

    } catch (error) {
        console.error(error);
        
    }
}
    

    return <CONTEXT.Provider
        value={{
            TOKEN_SWAP,
            LOAD_TOKEN,
            notifyError,
            notifySuccess,
            setLoader,
            loader,
            connect,
            address,
            swap,
            
        }}>
        {children}
    </CONTEXT.Provider>

};
