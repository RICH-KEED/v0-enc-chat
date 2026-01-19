require("@nomicfoundation/hardhat-toolbox")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") })

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ganache: {
      url: process.env.BLOCKCHAIN_RPC || "http://localhost:8545",
      chainId: Number.parseInt(process.env.NETWORK_ID || "1337"),
      accounts: process.env.BLOCKCHAIN_PRIVATE_KEY 
        ? [process.env.BLOCKCHAIN_PRIVATE_KEY] 
        : [],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: process.env.SEPOLIA_PRIVATE_KEY 
        ? [process.env.SEPOLIA_PRIVATE_KEY] 
        : [],
      gasPrice: "auto",
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://ethereum-rpc.publicnode.com",
      chainId: 1,
      accounts: process.env.MAINNET_PRIVATE_KEY 
        ? [process.env.MAINNET_PRIVATE_KEY] 
        : [],
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
