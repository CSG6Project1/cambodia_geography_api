import asyncHandler from 'express-async-handler'
import User from '../models/userModels.js'
import jwt from 'jsonwebtoken'
import { generateToken, generateRefreshToken } from '../utils/generateToken.js'
import admin from 'firebase-admin'

const userEmail = asyncHandler(async (req, res, next) => {
  if (req.body.grant_type === 'password') {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ email })
    if (user && password && (await user.matchPassword(password))) {
      const accessToken = generateToken(user._id, user.role, user.is_verify)
      const refreshToken = generateRefreshToken(
        user._id,
        user.role,
        user.is_verify
      )

      const response = {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 60 * 60 * 2,
        refresh_token: refreshToken,
        created_at: Date.now(),
      }
      res.response = response
      res.statusCode = 200
      next()
    } else {
      const response = {
        message: 'Email or Password is incorrect',
      }
      res.response = response
      res.statusCode = 401
      next()
    }
  } else if (req.body.grant_type === 'credential') {
    next()
  } else {
    next()
  }
})

const userCredential = asyncHandler(async (req, res, next) => {
  if (req.body.grant_type === 'credential') {
    const credential_id = req.body.id_token
    admin
      .auth()
      .verifyIdToken(credential_id)
      .then(async (decodedToken) => {
        const uid = decodedToken.uid
        const user = await User.findOne({ credential_id: uid })
        if (user) {
          const accessToken = generateToken(user._id, user.role, user.is_verify)
          const refreshToken = generateRefreshToken(
            user._id,
            user.role,
            user.is_verify
          )
          const response = {
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 60 * 60 * 2,
            refresh_token: refreshToken,
            created_at: Date.now(),
          }
          res.response = response
          res.statusCode = 200
          next()
        } else {
          const response = {
            message: 'User not found',
          }
          res.response = response
          res.statusCode = 401
          next()
        }
      })
      .catch((error) => {
        const response = {
          message: error.message,
        }
        res.response = response
        res.statusCode = 401
        next()
      })
  } else {
    next()
  }
})

const userRefreshToken = asyncHandler(async (req, res, next) => {
  if (req.body.grant_type === 'refresh_token') {
    const token = req.body.refresh_token
    if (!token) {
      const response = {
        message: 'Token not Found',
      }
      res.response = response
      res.statusCode = 401
      next()
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        const response = {
          message: 'Invalid Token',
        }

        res.response = response
        res.statusCode = 401
        next()
      }

      const { id } = user

      const accessToken = generateToken(id, user.role, user.is_verify)

      const response = {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 60 * 60 * 2,
        refresh_token: token,
        created_at: Date.now(),
      }
      res.response = response
      res.statusCode = 200
      next()
    })
  } else if (
    req.body.grant_type === 'credential' ||
    req.body.grant_type === 'password'
  ) {
    next()
  } else {
    const response = {
      message: 'grant_type not found',
    }
    res.response = response
    res.statusCode = 404
    next()
  }
})

export { userEmail, userCredential, userRefreshToken }
