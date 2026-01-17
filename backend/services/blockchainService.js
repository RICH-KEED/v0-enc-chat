const { ethers } = require("ethers")
const Logger = require("../utils/logger")
const config = require("../config")

class BlockchainService {
  constructor() {
    this.provider = null
    this.contract = null
    this.isInitialized = false
  }

  async initialize(rpcUrl = config.blockchainRpc) {
    try {
      if (!rpcUrl) {
        throw new Error("Blockchain RPC URL not configured")
      }

      this.provider = new ethers.JsonRpcProvider(rpcUrl)

      // Check if we have a contract address
      if (config.contractAddress) {
        const contractABI = [
          "function storeMessage(address sender, address receiver, string messageHash, uint256 timestamp) public returns (uint256)",
          "function getMessage(uint256 messageId) public view returns (address, address, string, uint256)",
          "function getMessageCount() public view returns (uint256)",
        ]

        this.contract = new ethers.Contract(config.contractAddress, contractABI, this.provider)
        Logger.success("Blockchain contract connected:", config.contractAddress)
      }

      this.isInitialized = true
      Logger.success("Blockchain service initialized")
      return true
    } catch (error) {
      Logger.warn("Blockchain initialization failed:", error.message)
      Logger.warn("Messages will be stored in database only")
      return false
    }
  }

  async storeMessage(fromUserId, toUserId, encryptedMessage, privateKey) {
    if (!this.isInitialized || !this.contract) {
      throw new Error("Blockchain service not initialized or contract not available")
    }

    try {
      // Create a wallet from private key
      const wallet = new ethers.Wallet(privateKey, this.provider)

      // Connect wallet to contract
      const contractWithSigner = this.contract.connect(wallet)

      // Create message hash
      const messageHash = ethers.keccak256(ethers.toUtf8Bytes(encryptedMessage))

      // Store message on blockchain
      const timestamp = Math.floor(Date.now() / 1000)

      // Convert user IDs to mock addresses (in production, use real wallet addresses)
      const senderAddress = this.userIdToAddress(fromUserId)
      const receiverAddress = this.userIdToAddress(toUserId)

      const tx = await contractWithSigner.storeMessage(senderAddress, receiverAddress, messageHash, timestamp)

      const receipt = await tx.wait()

      Logger.success("Message stored on blockchain:", receipt.hash)

      return {
        success: true,
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
      }
    } catch (error) {
      Logger.error("Blockchain storage failed:", error.message)
      throw error
    }
  }

  async getMessageCount() {
    if (!this.isInitialized || !this.contract) {
      return 0
    }

    try {
      const count = await this.contract.getMessageCount()
      return Number(count)
    } catch (error) {
      Logger.error("Failed to get message count:", error.message)
      return 0
    }
  }

  // Helper function to convert user ID to mock address
  userIdToAddress(userId) {
    // In production, this should return the user's actual wallet address
    // For development, generate a consistent address from user ID
    const hash = ethers.keccak256(ethers.toUtf8Bytes(userId))
    return "0x" + hash.slice(2, 42)
  }

  isAvailable() {
    return this.isInitialized && this.contract !== null
  }
}

module.exports = new BlockchainService()
