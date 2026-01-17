# Cipher Setup Guide

## Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

## Installation Steps

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install blockchain dependencies
cd ../blockchain
npm install
cd ..
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Start Blockchain (Ganache)

```bash
cd blockchain
npm run ganache
```

Keep this terminal running.

### 5. Deploy Smart Contract

In a new terminal:

```bash
cd blockchain
npm run compile
npm run deploy
```

This will create `deployment.json` with the contract address.

### 6. Update Environment Variables

Copy the contract address from `blockchain/deployment.json` to your `.env` file:

```
CONTRACT_ADDRESS=<address-from-deployment.json>
```

### 7. Start Backend Server

In a new terminal:

```bash
cd backend
npm start
```

Backend runs on http://localhost:5000

### 8. Start Frontend

In a new terminal:

```bash
npm run dev
```

Frontend runs on http://localhost:3000

## Usage

1. Register a new user at `/register`
2. Login at `/login`
3. Access user chat at `/user`
4. Access admin dashboard at `/admin` (admin login at `/admin/login`)

## Folder Structure

```
cipher/
├── app/                    # Next.js frontend
├── components/             # React components
├── backend/               # Express + Socket.IO server
│   ├── models/           # MongoDB models
│   ├── utils/            # Utilities
│   └── server.js         # Main server
├── blockchain/            # Blockchain service
│   ├── contracts/        # Solidity contracts
│   ├── scripts/          # Deployment scripts
│   └── blockchain.service.js
└── public/               # Static assets
```

## Troubleshooting

- If blockchain fails, ensure Ganache is running on port 8545
- If backend fails, check MongoDB connection
- Check all environment variables are set correctly
