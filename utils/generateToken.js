import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '2h' })
}

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET)
}

export { generateToken, generateRefreshToken }
