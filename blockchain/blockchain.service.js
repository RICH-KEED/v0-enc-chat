const { ethers } = require("ethers")
const fs = require("fs")
const path = require("path")

class BlockchainService {
  constructor() {
    this.provider = null
    this.contract = null
    this.wallet = null
  }

  async initialize(providerUrl) {
    try {
      this.provider = new ethers.JsonRpcProvider(providerUrl)

      const deploymentPath = path.join(__dirname, "deployment.json")
      if (!fs.existsSync(deploymentPath)) {
        throw new Error("Deployment file not found. Please deploy the contract first.")
      }

      const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"))
      const contractAbi = require("./artifacts/contracts/MessageStorage.sol/MessageStorage.json").abi

      this.contract = new ethers.Contract(deployment.contractAddress, contractAbi, this.provider)

      console.log("Blockchain service initialized successfully")
      return true
    } catch (error) {
      console.error("Failed to initialize blockchain service:", error.message)
      throw error
    }
  }

  async storeMessage(from, to, encryptedData, privateKey) {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized")
    }

    try {
      this.wallet = new ethers.Wallet(privateKey, this.provider)
      const contractWithSigner = this.contract.connect(this.wallet)

      const tx = await contractWithSigner.storeMessage(to, ethers.toUtf8Bytes(encryptedData))

      await tx.wait()
      return tx
    } catch (error) {
      console.error("Failed to store message on blockchain:", error.message)
      throw error
    }
  }

  async getMessage(messageId) {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized")
    }

    try {
      const message = await this.contract.getMessage(messageId)
      return {
        from: message.from,
        to: message.to,
        encryptedData: ethers.toUtf8String(message.encryptedData),
        timestamp: Number(message.timestamp),
        messageHash: message.messageHash,
      }
    } catch (error) {
      console.error("Failed to get message from blockchain:", error.message)
      throw error
    }
  }

  async getUserMessages(userAddress) {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized")
    }

    try {
      const messageIds = await this.contract.getUserMessages(userAddress)
      return messageIds.map((id) => Number(id))
    } catch (error) {
      console.error("Failed to get user messages from blockchain:", error.message)
      throw error
    }
  }

  async getTotalMessages() {
    if (!this.contract) {
      throw new Error("Blockchain service not initialized")
    }

    try {
      const total = await this.contract.getTotalMessages()
      return Number(total)
    } catch (error) {
      console.error("Failed to get total messages:", error.message)
      throw error
    }
  }

  async getBlockchainInfo() {
    if (!this.provider || !this.contract) {
      throw new Error("Blockchain service not initialized")
    }

    try {
      const network = await this.provider.getNetwork()
      const blockNumber = await this.provider.getBlockNumber()

      return {
        chainId: Number(network.chainId),
        blockNumber,
        contractAddress: await this.contract.getAddress(),
      }
    } catch (error) {
      console.error("Failed to get blockchain info:", error.message)
      throw error
    }
  }
}

module.exports = new BlockchainService()
