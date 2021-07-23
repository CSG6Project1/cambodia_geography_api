import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token
  const authHeader = req.headers.authorization
  if (authHeader) {
    try {
      token = authHeader.split(' ')[1]
      const decoded = jwt.decode(token, process.env.JWT_SECRET)
      req.id = decoded.userId
      req.role = decoded.role
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
