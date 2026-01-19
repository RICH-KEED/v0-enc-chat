# Cipher - Encrypted Chat Application

Complete encrypted messaging platform with blockchain verification, self-destructing messages, and admin dashboard.

## Features

- End-to-end encrypted messaging
- Self-destruct messages with countdown timers
- Blockchain message verification
- User authentication & profile management
- Admin dashboard with analytics
- Real-time communication via Socket.IO
- MongoDB Cloud Atlas integration
- Ganache local blockchain for development

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Ganache CLI (optional, for blockchain testing)

## Environment Setup

### Frontend & Backend

Create a `.env.local` file in the root directory:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipher
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
BLOCKCHAIN_RPC=http://localhost:8545
CONTRACT_ADDRESS=0x...
BLOCKCHAIN_PRIVATE_KEY=0x...
NETWORK_ID=1337
GAS_LIMIT=3000000
CORS_ORIGIN=http://localhost:3000
PORT=3000
```

### Blockchain

Create `blockchain/.env`:

```bash
BLOCKCHAIN_PRIVATE_KEY=0x...
GANACHE_PORT=8545
```

## Installation

```bash
npm install

# Install blockchain dependencies
cd blockchain
npm install
cd ..
```

## Running Locally

### 1. Start Ganache (Terminal 1)
```bash
npm run blockchain:ganache
```

### 2. Start Backend Server (Terminal 2)
```bash
npm run backend:start
```

### 3. Start Frontend Dev Server (Terminal 3)
```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment to Vercel

### One-Click Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `NEXT_PUBLIC_SOCKET_URL` - Your Vercel deployment URL
   - `JWT_SECRET` - Secret key for JWT tokens
   - `BLOCKCHAIN_RPC` - Blockchain RPC endpoint
   - `CONTRACT_ADDRESS` - Deployed contract address
   - And other blockchain env vars

5. Click "Deploy"

### Manual Deploy

```bash
npm run deploy
```

## Project Structure

```
/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   ├── login/               # User login
│   ├── register/            # User registration
│   ├── admin/               # Admin dashboard
│   ├── user/                # User chat interface
│   └── ...
├── components/              # React components
│   ├── chat/               # Chat components
│   ├── admin/              # Admin components
│   ├── ui/                 # UI components
│   └── ...
├── backend/                 # Node.js backend
│   ├── server.js           # Express server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities
│   └── services/           # Business logic
├── blockchain/              # Blockchain & smart contracts
│   ├── contracts/          # Solidity contracts
│   ├── scripts/            # Deployment scripts
│   ├── hardhat.config.js   # Hardhat config
│   └── package.json        # Blockchain dependencies
├── lib/                     # Shared utilities
├── public/                  # Static assets
└── package.json             # Frontend dependencies
```

## Features Documentation

### User Authentication
- Email/password login and registration
- Blockchain wallet authentication option
- JWT-based session management

### Chat Features
- Real-time encrypted messaging
- Self-destruct messages (10s - 5min)
- Friend requests and management
- Status indicators (online, idle, DND, offline)
- Message history with blockchain verification

### Admin Dashboard
- Real-time user activity monitoring
- System health metrics
- User management
- Blockchain transaction explorer
- Analytics and performance charts

### Blockchain Integration
- Message storage on-chain with hash verification
- Transaction explorer
- Smart contract interaction
- Local Ganache for development, mainnet support for production

## Troubleshooting

### Backend not connecting
- Ensure MongoDB URI is correct
- Check if backend server is running on port 3000
- Verify CORS settings

### Socket.IO connection issues
- Check NEXT_PUBLIC_SOCKET_URL environment variable
- Ensure backend and frontend are on same port/domain
- Clear browser cache

### Blockchain issues
- Ensure Ganache is running on port 8545
- Check hardhat.config.js for correct network settings
- Verify CONTRACT_ADDRESS is set

## Support

For issues and feature requests, create an issue on GitHub.
