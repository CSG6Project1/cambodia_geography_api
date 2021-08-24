import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token
  const authHeader = req.headers.authorization
  if (authHeader) {
    try {
      token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.id = decoded.id
      req.role = decoded.role
      const user = await User.findById(decoded.id)
      if (user && user.email && !decoded.is_verify) {
        return res.status(401).send({
          message: 'You must verify your account first',
        })
      }

      next()
    } catch (error) {
      res.status(401).send({
        message: 'JWT expired',
      })
    }
  }

  if (!token) {
    res.status(401).send({
      message: 'Not Authorized, Token not found',
    })
  }
})

export default authMiddleware
