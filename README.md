# Cipher - End-to-End Encrypted Chat Platform

A premium, enterprise-grade encrypted messaging platform with blockchain verification and real-time communication.

## Features

### User Features
- End-to-end encrypted messaging
- Self-destructing messages with countdown timers
- Blockchain verification for message integrity
- Real-time online status (Online, Idle, DND, Offline)
- Friend request system
- Profile management with photo upload
- Message history and conversation management

### Admin Features
- Real-time system dashboard
- User management and monitoring
- Blockchain transaction explorer
- System analytics and metrics
- Activity feed tracking
- Message rate monitoring

### Technical Features
- Socket.IO for real-time communication
- MongoDB for data persistence
- Ethereum smart contracts for message verification
- JWT authentication
- Responsive dark theme UI

## Project Structure

```
cipher/
├── app/                      # Next.js frontend
│   ├── login/               # User login page
│   ├── register/            # User registration
│   ├── user/                # User interface
│   │   ├── page.tsx         # Main chat interface
│   │   ├── settings/        # User settings
│   │   ├── add-friend/      # Friend management
│   │   └── blockchain/      # Blockchain logs
│   └── admin/               # Admin interface
│       ├── login/           # Admin login
│       ├── page.tsx         # Admin dashboard
│       ├── users/           # User management
│       ├── blockchain/      # Blockchain explorer
│       └── analytics/       # System analytics
├── components/              # React components
│   ├── chat/               # Chat-related components
│   ├── admin/              # Admin components
│   └── ui/                 # UI primitives
├── backend/                # Node.js backend
│   ├── models/            # MongoDB models
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── server.js          # Express + Socket.IO server
└── blockchain/            # Ethereum integration
    ├── contracts/         # Solidity smart contracts
    ├── scripts/           # Deployment scripts
    └── hardhat.config.js  # Hardhat configuration
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB instance
- Ethereum RPC endpoint (Ganache for local, or testnet)

### 1. Frontend Setup

The frontend runs in v0 and requires no installation. It uses the following environment variables:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=3001
MONGODB_URI=mongodb://localhost:27017/cipher
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-secret-key-change-this
BLOCKCHAIN_RPC=http://localhost:8545
CONTRACT_ADDRESS=0x...
BLOCKCHAIN_PRIVATE_KEY=0x...
NETWORK_ID=1337
GAS_LIMIT=3000000
EOF

# Start the server
npm start
```

### 3. Blockchain Setup

```bash
cd blockchain
npm install

# Option A: Local Development (Ganache)
npm install -g ganache
ganache --port 8545 --chainId 1337

# Deploy contract
npx hardhat run scripts/deploy-local.js --network ganache

# Option B: Testnet (Sepolia/Goerli)
# Update hardhat.config.js with testnet configuration
npx hardhat run scripts/deploy-local.js --network sepolia
```

### 4. MongoDB Setup

#### MongoDB Cloud Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user: Database Access → Add New Database User
4. Whitelist IP: Network Access → Add IP Address (0.0.0.0/0 for dev)
5. Get connection string: Clusters → Connect → Connect your application
6. Add to backend `.env` as MONGODB_URI

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipher?retryWrites=true&w=majority
```

## Running the Application

1. Ensure MongoDB Atlas cluster is running
2. Start the backend server: `cd backend && npm start`
3. Start the blockchain (if using local Ganache)
4. Access the frontend at your v0 preview URL

## Default Accounts

### User Login
- Register a new account at `/register`
- Login at `/login` with email/password or blockchain wallet

### Admin Login
- URL: `/admin/login`
- Default credentials: `admin@cipher.com` / `admin123`
- Change in production!

## Environment Variables Reference

### Frontend (NEXT_PUBLIC_*)
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Backend
```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipher?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-jwt-secret
BLOCKCHAIN_RPC=http://localhost:8545
CONTRACT_ADDRESS=0x...
BLOCKCHAIN_PRIVATE_KEY=0x...
NETWORK_ID=1337
GAS_LIMIT=3000000
```

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB with Mongoose
- **Blockchain**: Ethereum, Solidity, Hardhat, Ethers.js
- **Authentication**: JWT, bcrypt
- **Real-time**: Socket.IO

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- End-to-end message encryption (base64 placeholder, implement AES-256)
- Blockchain verification for message integrity
- Input validation and sanitization
- CORS protection
- Secure session management

## Development Notes

- Messages are currently base64 encoded - implement proper AES-256-GCM encryption for production
- Admin credentials are hardcoded - implement proper admin authentication
- Self-destruct messages work client-side - add server-side cleanup
- Blockchain integration is optional - app works without it

## Production Deployment

1. Deploy frontend to Vercel
2. Deploy backend to your server/cloud provider
3. MongoDB Atlas is already cloud-ready for production
4. Deploy smart contract to mainnet/L2
5. Update all environment variables
6. In MongoDB Atlas: Remove 0.0.0.0/0 IP whitelist, add specific IPs
7. Enable HTTPS
8. Implement proper encryption algorithms
9. Set up monitoring and logging

## License

Proprietary - All rights reserved
