// Deploy script for Sepolia testnet
const hre = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("Deploying MessageStorage contract to Sepolia testnet...")

  const signers = await hre.ethers.getSigners()
  if (signers.length === 0) {
    throw new Error("No signers available. Make sure SEPOLIA_PRIVATE_KEY is set in your .env file.")
  }
  
  const deployer = signers[0]
  console.log("Deploying contracts with account:", deployer.address)
  
  const balance = await hre.ethers.provider.getBalance(deployer.address)
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH")
  
  if (balance === 0n) {
    console.error("\n❌ ERROR: Your account has 0 ETH!")
    console.log("Get Sepolia ETH from faucets:")
    console.log("  - https://sepoliafaucet.com/")
    console.log("  - https://www.alchemy.com/faucets/ethereum-sepolia")
    console.log("  - https://cloud.google.com/application/web3/faucet/ethereum/sepolia")
    process.exit(1)
  }

  console.log("\n⏳ Deploying contract...")
  const MessageStorage = await hre.ethers.getContractFactory("MessageStorage")
  const messageStorage = await MessageStorage.deploy()

  await messageStorage.waitForDeployment()

  const contractAddress = await messageStorage.getAddress()

  console.log("\n✅ MessageStorage deployed to:", contractAddress)
  console.log("🔗 View on Etherscan: https://sepolia.etherscan.io/address/" + contractAddress)
  
  console.log("\n📝 Add these to your .env file:")
  console.log(`CONTRACT_ADDRESS=${contractAddress}`)
  console.log(`BLOCKCHAIN_RPC=${process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com"}`)
  console.log(`NETWORK_ID=11155111`)

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: "sepolia",
    chainId: 11155111,
    rpcUrl: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
    deployedAt: new Date().toISOString(),
    deployerAddress: deployer.address,
  }

  const deploymentPath = path.join(__dirname, "../deployment.json")
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2))
  console.log("\n💾 Deployment info saved to:", deploymentPath)

  // Verify on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n⏳ Waiting 30 seconds before verification...")
    await new Promise(resolve => setTimeout(resolve, 30000))
    
    console.log("🔍 Verifying contract on Etherscan...")
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      })
      console.log("✅ Contract verified on Etherscan!")
    } catch (error) {
      console.error("❌ Verification failed:", error.message)
      console.log("\nYou can verify manually later with:")
      console.log(`npx hardhat verify --network sepolia ${contractAddress}`)
    }
  } else {
    console.log("\n⚠️  ETHERSCAN_API_KEY not set. Skipping verification.")
    console.log("To verify manually later:")
    console.log(`npx hardhat verify --network sepolia ${contractAddress}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


