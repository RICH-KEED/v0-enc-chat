const Logger = require("./logger")

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

const errorHandler = (error, socket) => {
  Logger.error("Error occurred:", error.message)

  if (error.isOperational) {
    socket.emit("error", {
      message: error.message,
      statusCode: error.statusCode,
    })
  } else {
    socket.emit("error", {
      message: "An unexpected error occurred",
      statusCode: 500,
    })
  }
}

const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      await fn(...args)
    } catch (error) {
      errorHandler(error, args[0])
    }
  }
}

module.exports = { AppError, errorHandler, asyncHandler }
