# Ganache Setup Guide

## Current Running Instance

Ganache is successfully running with the following configuration:

### Network Details
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 1337
- **Network**: Ganache Local

### Test Accounts (with 1000 ETH each)

| Account Index | Address |
|--------------|---------|
| 0 | 0x35f78101D5A43aECD1AEeb5bDb2fA7842879AEdf |
| 1 | 0xc1B96e312ae8EE4B26d38fd5206e82F0f925aB88 |
| 2 | 0x7c0816A518E9a5e9f2e65a8Aa6B1C3EE09d14793 |

> **Security Note**: Private keys are sensitive. Never commit them to git. Use the `.env` file (which is gitignored) to store them locally.

### Mnemonic
```
rude state goddess spawn cereal tunnel debate eagle lemon jungle ancient ugly
```

### Gas Configuration
- **Default Gas Price**: 2000000000
- **Block Gas Limit**: 30000000
- **Call Gas Limit**: 50000000

## Setup Instructions

### 1. Create .env File

Copy the example environment file and add your private key:

```bash
cd blockchain
cp .env.example .env
```

### 2. Add Your Private Key

Edit the `.env` file and add one of the private keys from your Ganache instance:

```env
BLOCKCHAIN_RPC=http://localhost:8545
NETWORK_ID=1337
BLOCKCHAIN_PRIVATE_KEY=0x387b907d0175d8237cfe9b58ba6f272f96145aa97e34cbfa400caec6224cc37b
GAS_LIMIT=3000000
```

> **Important**: The `.env` file is gitignored and will NOT be committed to version control.

### 3. Get Private Keys from Ganache

When Ganache starts, it displays all account private keys. Copy one and paste it into your `.env` file.

Example from the output above:
- Account 0: `0x387b907d0175d8237cfe9b58ba6f272f96145aa97e34cbfa400caec6224cc37b`
- Account 1: `0xc6ffcb6b57b1cc97902112fd55d4a3c70e4eb0fba8d64bf2b651d501f5c32ed7`
- Account 2: `0x61748d8e6045bf3a124e215c6c6203d288a5cd1bbd4bc41cbb7b89718dd5683c`

## Deploy Smart Contract

After setting up your `.env` file, deploy the MessageStorage contract:

```bash
cd blockchain
npm run deploy
```

This will:
1. Load your private key from `.env`
2. Compile the Solidity contract
3. Deploy it to the running Ganache instance
4. Output the contract address
5. Save deployment info to `deployment.json`

## Environment Variables for Backend

After deployment, copy these values to your backend `.env`:

```env
BLOCKCHAIN_RPC=http://localhost:8545
NETWORK_ID=1337
CONTRACT_ADDRESS=<address_from_deployment>
BLOCKCHAIN_PRIVATE_KEY=<same_key_as_blockchain_env>
GAS_LIMIT=3000000
```

## Keep Ganache Running

Ganache must stay running while you develop. If you close it, you'll need to redeploy contracts.

## Security Best Practices

1. **NEVER** commit `.env` files to git
2. **NEVER** hardcode private keys in source code
3. Use `.env.example` to show required variables without exposing secrets
4. For production, use hardware wallets or secure key management services
5. Ganache keys are for local testing ONLY - never use them in production

## Notes

- The minor `Error: write EINVAL` at startup is harmless and doesn't affect functionality
- All accounts start with 1000 ETH for testing
- Data is reset when Ganache restarts unless you use `--database` flag
