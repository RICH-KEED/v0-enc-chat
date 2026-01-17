// Deploy script for local Ganache blockchain
const hre = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("Deploying MessageStorage contract to local blockchain...")

  const MessageStorage = await hre.ethers.getContractFactory("MessageStorage")
  const messageStorage = await MessageStorage.deploy()

  await messageStorage.waitForDeployment()

  const contractAddress = await messageStorage.getAddress()

  console.log("MessageStorage deployed to:", contractAddress)
  console.log("")
  console.log("Add these to your .env file:")
  console.log(`CONTRACT_ADDRESS=${contractAddress}`)
  console.log(`BLOCKCHAIN_RPC=http://localhost:8545`)
  console.log(`NETWORK_ID=1337`)
  console.log(`BLOCKCHAIN_PRIVATE_KEY=0x387b907d0175d8237cfe9b58ba6f272f96145aa97e34cbfa400caec6224cc37b`)
  console.log(`GAS_LIMIT=3000000`)

  const deploymentInfo = {
    contractAddress,
    network: "ganache",
    chainId: 1337,
    rpcUrl: "http://localhost:8545",
    deployedAt: new Date().toISOString(),
  }

  const deploymentPath = path.join(__dirname, "../deployment.json")
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2))
  console.log("\nDeployment info saved to:", deploymentPath)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
