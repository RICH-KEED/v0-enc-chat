# Cipher Blockchain Integration

This folder contains the smart contracts and blockchain configuration for Cipher's decentralized message storage.

## Smart Contract

**MessageStorage.sol** - Stores encrypted message hashes on the blockchain for verification and immutability.

## Quick Start

### 1. Install Dependencies
```bash
cd blockchain
npm install
```

### 2. Start Local Blockchain
```bash
npm run ganache
```

This will start Ganache on port 8545 with chain ID 1337 and deterministic wallet addresses.

### 3. Deploy Contract (in a new terminal)
```bash
cd blockchain
npm run deploy:local
```

The contract address will be saved to `deployment.json` and automatically used by the backend.

## Environment Variables

Your backend already has these environment variables configured:

```env
BLOCKCHAIN_RPC=http://localhost:8545
CONTRACT_ADDRESS=(auto-populated after deployment)
BLOCKCHAIN_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
NETWORK_ID=1337
GAS_LIMIT=3000000
```

## Alternative: Use Test Networks

### Sepolia Testnet (Recommended for staging)
```bash
# Add to your .env file
BLOCKCHAIN_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
NETWORK_ID=11155111

# Deploy
npx hardhat run scripts/deploy-local.js --network sepolia
```

### Polygon Mumbai (Low-cost alternative)
```bash
BLOCKCHAIN_RPC=https://rpc-mumbai.maticvigil.com
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
NETWORK_ID=80001
```

## Production Deployment

For production, use mainnet networks:
- Ethereum Mainnet
- Polygon Mainnet
- Arbitrum One
- Optimism

Update your environment variables accordingly and deploy using:
```bash
npx hardhat run scripts/deploy-local.js --network mainnet
```

## Troubleshooting

**Ganache Won't Start?**
- Make sure port 8545 is not in use: `lsof -i :8545`
- Try reinstalling: `npm install -g ganache@latest`

**Contract Deployment Failed?**
- Ensure Ganache is running first
- Check that blockchain folder has `node_modules` installed
- Verify hardhat config network matches your setup

**Backend Can't Connect?**
- Check `BLOCKCHAIN_RPC` points to running blockchain
- Verify `CONTRACT_ADDRESS` is set after deployment
- Ensure `BLOCKCHAIN_PRIVATE_KEY` matches an account with funds
</md>
