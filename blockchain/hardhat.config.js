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
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
