# UNISWAP-EXCHANGE

UNISWAP-EXCHANGE is a decentralized application (DApp) for swapping WETH (Wrapped Ether) with USDC (USD Coin) on the Ethereum blockchain. This project uses Uniswap's decentralized exchange (DEX) protocols and provides a simple interface to facilitate token swaps.

## Features

- Swap WETH to USDC
- Utilizes Uniswap V3 liquidity pools
- Built using Next.js and Hardhat
- Supports MetaMask wallet integration

## Tech Stack

- **Frontend:** Next.js, React.js, Bootstrap
- **Blockchain:** Ethereum, Hardhat
- **State Management:** React Context API
- **Smart Contracts:** Solidity, Uniswap V3 SDK
- **Wallet Integration:** MetaMask

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) or npm
- [MetaMask](https://metamask.io/) browser extension
- [Hardhat](https://hardhat.org/)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/UNISWAP-EXCHANGE.git
cd UNISWAP-EXCHANGE
```

### 2. Install frontend dependencies

In the root directory, run:

```bash
npm install
```

or if you're using Yarn:

```bash
yarn install
```

### 3. Install backend (Hardhat) dependencies

Go to the `fork` folder:

```bash
cd fork
npm install
```

### 4. Setup .env

Create a `.env` file in the root of the project and add your environment variables (such as Infura/Alchemy API keys, wallet addresses, etc.)

Example `.env` file:

```env
INFURA_API_KEY=your-infura-api-key
WALLET_PRIVATE_KEY=your-wallet-private-key
```

## Running the Project

### 1. Launch the Forked Mainnet

In the `fork` folder, run:

```bash
npx hardhat node
```

### 2. Launch the Frontend

From the root directory, run:

```bash
npm run dev
```

### 3. Connect to MetaMask Wallet

Open the frontend in your browser (usually at `http://localhost:3000`) and click the "Connect" button to link your MetaMask wallet.

### 4. Fund Your Wallet

To fund your MetaMask wallet with some ETH, run the following command:

```bash
node sendEth.js
```

### 5. Deploy WETH Contract

Deploy the WETH contract by running:

```bash
node deploy_weth.js
```

### 6. Swap WETH for USDC

Now you can use the frontend to swap WETH for USDC!

## Usage

Once the setup is complete, you can interact with the platform using the frontend interface. The steps include:

- Connecting your MetaMask wallet
- Depositing some ETH
- Deploying the WETH contract
- Swapping WETH with USDC using the Uniswap DEX

## Contributing

Feel free to fork the repository and make your improvements. If you wish to contribute to the project, open a pull request or submit an issue.

## License

This project is licensed under the MIT License.


