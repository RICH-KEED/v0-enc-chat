# Cipher Backend

Node.js backend server with Socket.IO for real-time messaging and MongoDB Cloud for data persistence.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipher?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-secret-key
BLOCKCHAIN_RPC=http://localhost:8545
CONTRACT_ADDRESS=0x...
BLOCKCHAIN_PRIVATE_KEY=0x...
NETWORK_ID=1337
GAS_LIMIT=3000000
```

## MongoDB Cloud Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your IP address (0.0.0.0/0 for development)
5. Get connection string and add to MONGODB_URI
6. Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`

## Running

```bash
# Development
npm run dev

# Production
npm start
```

## Socket Events

### Authentication
- `register-user` - Register new user
- `login-user` - Login existing user

### Messaging
- `send-message` - Send encrypted message
- `get-conversation` - Get message history
- `new-message` - Receive new message

### User Management
- `get-online-users` - Get online users list
- `get-all-users` - Get all users
- `update-status` - Update user status
- `send-friend-request` - Send friend request

### Admin
- `get-stats` - Get system statistics
- `get-blockchain-logs` - Get blockchain transaction logs

## API Structure

The server uses Socket.IO for all communication. No REST endpoints.
