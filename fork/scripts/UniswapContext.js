// INTERNAL IMPORTS
const { ethers } = require("hardhat");
const { SwapRouter } = require("@uniswap/universal-router-sdk");
require("dotenv").config({ path: "../../.env" });

const {
    TradetType,
    Ether,
    Token,
    CurrencyAmount,
    Percent,
    TradeType,
} = require("@uniswap/sdk-core");
const { Trade: V2Trade } = require("@uniswap/v2-sdk");
const {
    Pool,
    nearestUsableTick,
    TickMath,
    TICK_SPACINGS,
    FeeAmount,
    Trade: V3Trade,
    Route: RouteV3,
} = require("@uniswap/v3-sdk");
const {
    MixedRouteTrade,
    Trade: RouterTrade,
} = require("@uniswap/router-sdk");
const IUniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json");

const JSBI = require("jsbi");
const erc20Abi = require("../abis__erc20.json");

const hardhat = require("hardhat");
const provider = ethers.provider;
console.log("Provider Check:", provider ? "Valid" : "Invalid");

// --- CONSTANT TOKENS ---
/** @type {Ether} Native Ethereum token used for routing */
const ETHER = Ether.onChain(1);

/** @type {Token} Wrapped Ether token (WETH) */
const WETH = new Token(
    1,
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    18,
    "WETH",
    "Wrapped Ether"
);

/** @type {Token} USDC token */
const USDC = new Token(
    1,
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    6,
    "USDC",
    "USD Coin"
);

// ERC-20 contract instances
const wethContract = new hardhat.ethers.Contract(WETH.address, erc20Abi, provider);
const usdcContract = new hardhat.ethers.Contract(USDC.address, erc20Abi, provider);

/**
 * Retrieves and constructs a Uniswap V3 Pool instance for a token pair
 * @async
 * @param {Token} tokenA 
 * @param {Token} tokenB 
 * @param {number} feeAmount 
 * @param {ethers.providers.Provider} provider 
 * @returns {Promise<Pool>}
 */
async function getPool(tokenA, tokenB, feeAmount, provider) {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    const poolAddress = Pool.getAddress(token0, token1, feeAmount);

    console.log("Pool Address:", poolAddress);
    console.log("Token0:", token0.address);
    console.log("Token1:", token1.address);
    console.log("Fee Amount:", feeAmount);

    const contract = new hardhat.ethers.Contract(
        poolAddress,
        JSON.parse(JSON.stringify(IUniswapV3Pool.abi)),
        provider
    );

    let liquidity = await contract.liquidity();
    let { sqrtPriceX96, tick } = await contract.slot0();

    liquidity = JSBI.BigInt(liquidity.toString());
    sqrtPriceX96 = JSBI.BigInt(sqrtPriceX96.toString());

    // Constructs a new V3 Pool instance
    return new Pool(token0, token1, feeAmount, sqrtPriceX96, liquidity, tick, [
        {
            index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
            liquidityNet: liquidity,
            liquidityGross: liquidity,
        },
        {
            index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
            liquidityNet: JSBI.multiply(liquidity, JSBI.BigInt("-1")),
            liquidityGross: liquidity,
        },
    ]);
}

/**
 * Returns default swap options merged with overrides
 * @param {object} options 
 * @returns {object}
 */
function swapOptions(options) {
    return Object.assign(
        {
            slippageTolerance: new Percent(5, 1000),
            recipient: RECIPIENT,
        },
        options
    );
}

/**
 * Builds a RouterTrade from V2/V3/Mixed trades
 * @param {Array<V2Trade | V3Trade | MixedRouteTrade>} trades 
 * @returns {RouterTrade}
 */
function buildTrade(trades) {
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
    });
}

// 🔐 Replace with your testing wallet
const RECIPIENT = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

/**
 * Main function to build and simulate a Uniswap V3 trade using a forked mainnet
 * @async
 */
async function main() {
    const signer = await hardhat.ethers.getImpersonatedSigner(RECIPIENT);

    // Get the V3 pool between WETH and USDC with medium fee
    const WETH_USDC_V3 = await getPool(WETH, USDC, FeeAmount.MEDIUM, provider);

    const inputEther = hardhat.ethers.utils.parseEther("10").toString();

    // Create trade object from route
    const trade = await V3Trade.fromRoute(
        new RouteV3([WETH_USDC_V3], ETHER, USDC),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
    );

    const routerTrade = buildTrade([trade]);
    const opts = swapOptions({});
    const params = SwapRouter.swapCallParameters(routerTrade, opts);

    // Balance tracking before swap
    let ethBalance = await provider.getBalance(RECIPIENT);
    let wethBalance = await wethContract.balanceOf(RECIPIENT);
    let usdcBalance = await usdcContract.balanceOf(RECIPIENT);

    console.log("----------- BEFORE");
    console.log("ETH:", hardhat.ethers.utils.formatUnits(ethBalance, 18));
    console.log("WETH:", hardhat.ethers.utils.formatUnits(wethBalance, 18));
    console.log("USDC:", hardhat.ethers.utils.formatUnits(usdcBalance, 6));

    // Perform the swap transaction
    const tx = await signer.sendTransaction({
        data: params.calldata,
        to: "0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B", // Uniswap V3 Universal Router
        value: params.value,
        from: RECIPIENT,
    });
    const receipt = await tx.wait();

    console.log("--------------- SUCCESS");
    console.log("Status:", receipt.status);

    // Post-swap balances
    ethBalance = await provider.getBalance(RECIPIENT);
    wethBalance = await wethContract.balanceOf(RECIPIENT);
    usdcBalance = await usdcContract.balanceOf(RECIPIENT);

    console.log("----------- AFTER");
    console.log("ETH:", hardhat.ethers.utils.formatUnits(ethBalance, 18));
    console.log("WETH:", hardhat.ethers.utils.formatUnits(wethBalance, 18));
    console.log("USDC:", hardhat.ethers.utils.formatUnits(usdcBalance, 6));
}

// ENTRY POINT
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
