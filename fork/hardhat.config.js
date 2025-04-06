require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: "../../.env" });
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/cc84503ccf234b22b16210c7cd378a54`,//${process.env.INFURA_API_KEY}`,
    
      },
    },
  },
};
