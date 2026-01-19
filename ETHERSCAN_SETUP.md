# Etherscan Integration Setup

This guide will help you deploy your smart contract to Sepolia testnet and verify it on Etherscan.

## Prerequisites

1. **Get an Etherscan API Key**
   - Go to https://etherscan.io/
   - Create an account (free)
   - Go to https://etherscan.io/myapikey
   - Click "Add" to create a new API key
   - Copy the API key

2. **Get Sepolia Testnet ETH**
   - You need Sepolia ETH to pay for gas fees (it's free testnet ETH)
   - Use these faucets:
     - https://sepoliafaucet.com/
     - https://www.alchemy.com/faucets/ethereum-sepolia
     - https://cloud.google.com/application/web3/faucet/ethereum/sepolia
   - You'll need to provide your wallet address

3. **Get a Wallet Private Key**
   - Option A: Create a new MetaMask wallet (recommended for testing)
     - Install MetaMask browser extension
     - Create a new wallet
     - Go to Account Details → Show Private Key
     - Copy your private key
   - Option B: Use an existing wallet (⚠️ use a test wallet, not your main one!)

## Setup Steps

### 1. Add to your `.env` file:

```env
# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY_HERE

# Sepolia Testnet Configuration
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
SEPOLIA_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

**⚠️ IMPORTANT:** Never commit your `.env` file to GitHub!

### 2. Get Sepolia ETH

Before deploying, your wallet needs Sepolia ETH:

1. Get your wallet address:
   ```bash
   # You can see it when you try to deploy, or check MetaMask
   ```

2. Visit a faucet and request ETH for your address

3. Wait 1-5 minutes for the ETH to arrive

### 3. Deploy to Sepolia

```bash
cd blockchain
npm run deploy:sepolia
```

This will:
- Deploy your `MessageStorage` contract to Sepolia testnet
- Automatically verify it on Etherscan (if `ETHERSCAN_API_KEY` is set)
- Give you the contract address and Etherscan link

### 4. Update your `.env` with the new contract address

After deployment, update these in your `.env`:

```env
CONTRACT_ADDRESS=0xYOUR_NEW_CONTRACT_ADDRESS
BLOCKCHAIN_RPC=https://ethereum-sepolia-rpc.publicnode.com
NETWORK_ID=11155111
```

### 5. Restart your backend

```bash
cd backend
npm start
```

Now your app will interact with the real Sepolia blockchain!

## How to View Your Blocks on Etherscan

After deploying:

1. Your contract will be at: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
2. Click the "Contract" tab to see verified source code
3. Click "Read Contract" to see stored messages
4. Click "Write Contract" to interact with the contract
5. All transactions will appear in the "Transactions" tab

## Cost Estimate

- **Local Ganache**: FREE (but blocks only exist on your computer)
- **Sepolia Testnet**: FREE (uses free testnet ETH)
- **Mainnet**: $$$ (uses real ETH, costs $5-50 per deployment + gas per message)

## Switching Between Ganache and Sepolia

### Use Local Ganache (for development)
```bash
# In .env
CONTRACT_ADDRESS=<your-local-ganache-contract>
BLOCKCHAIN_RPC=http://localhost:8545
NETWORK_ID=1337
```

### Use Sepolia (for public testing)
```bash
# In .env
CONTRACT_ADDRESS=<your-sepolia-contract>
BLOCKCHAIN_RPC=https://ethereum-sepolia-rpc.publicnode.com
NETWORK_ID=11155111
```

Just change these 3 values in `.env` and restart your backend!

## Troubleshooting

### "Insufficient funds"
- Get more Sepolia ETH from faucets

### "Verification failed"
- Wait 1-2 minutes and manually verify:
  ```bash
  npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
  ```

### "Invalid API Key"
- Check your `ETHERSCAN_API_KEY` in `.env`
- Make sure there are no spaces or quotes

### "Transaction underpriced"
- The network is congested. Wait a few minutes and try again.

## Security Notes

🔒 **NEVER:**
- Share your private keys
- Commit `.env` to GitHub
- Use your main wallet for testing
- Deploy to mainnet unless you know what you're doing

✅ **ALWAYS:**
- Use a separate test wallet for Sepolia
- Keep your `.env` file in `.gitignore`
- Test on Sepolia before considering mainnet


