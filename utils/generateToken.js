import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const generateToken = (id, role, is_verify) => {
  return jwt.sign({ id, role, is_verify }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  })
}

const generateRefreshToken = (id, role, is_verify) => {
  return jwt.sign({ id, role, is_verify }, process.env.JWT_REFRESH_SECRET)
}

export { generateToken, generateRefreshToken }
