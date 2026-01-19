require("dotenv").config()

const parseCorsOrigin = (origin) => {
  if (!origin) return "*"
  if (origin.includes(",")) {
    return origin.split(",").map((o) => o.trim())
  }
  return origin
}

const isProduction = () => process.env.NODE_ENV === "production"
const isDevelopment = () => process.env.NODE_ENV === "development"

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN || "http://localhost:3000"),
  blockchainRpc: process.env.BLOCKCHAIN_RPC || "http://localhost:8545",
  jwtSecret: process.env.JWT_SECRET || "cipher-secret-key-change-in-production",
  environment: process.env.NODE_ENV || "development",
  isProduction,
  isDevelopment,
}
