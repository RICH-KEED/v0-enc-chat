const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 30
}

const validateMessage = (message) => {
  return message && message.trim().length > 0
}

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input
  return input.trim().replace(/[<>]/g, "")
}

const validateUserRegistration = (data) => {
  const errors = []

  if (!data.username || !validateUsername(data.username)) {
    errors.push("Username must be 3-30 characters")
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Invalid email format")
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

module.exports = {
  validateEmail,
  validateUsername,
  validateMessage,
  sanitizeInput,
  validateUserRegistration,
}
