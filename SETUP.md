# Cipher - Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Blockchain
BLOCKCHAIN_RPC=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your_private_key_from_ganache
CONTRACT_ADDRESS=your_contract_address_after_deployment

# Server
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 3. Start Blockchain (Terminal 1)
```bash
cd blockchain
npm run ganache
```
Copy the first private key from the output.

### 4. Deploy Smart Contract (Terminal 2)
```bash
cd blockchain
npm run deploy:ganache
```
Copy the contract address from the output and update your `.env` file.

### 5. Start Backend Server (Terminal 3)
```bash
cd backend
npm start
```

### 6. Start Frontend (Terminal 4)
```bash
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Ganache Blockchain**: http://localhost:8545

## Quick Commands

| Service | Command | Directory |
|---------|---------|-----------|
| Frontend | `npm run dev` | Root |
| Backend | `npm start` | `backend/` |
| Blockchain | `npm run ganache` | `blockchain/` |
| Deploy Contract | `npm run deploy:ganache` | `blockchain/` |

## Default Accounts

After registration, you can:
- Send encrypted messages
- View blockchain-verified messages
- Access admin dashboard at `/admin`

## Troubleshooting

- **Port already in use**: Kill processes on ports 3000, 3001, or 8545
- **MongoDB connection error**: Check your `MONGODB_URI` in `.env`
- **Blockchain error**: Make sure Ganache is running before starting the backend
- **Contract not found**: Redeploy the contract and update `CONTRACT_ADDRESS`

## Support

For issues, check the main README.md or create an issue on GitHub.
