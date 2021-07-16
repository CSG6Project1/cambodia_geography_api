import asyncHandler from 'express-async-handler'
import User from '../models/userModels.js'
import { generateRefreshToken, generateToken } from '../utils/generateToken.js'

const userLogin = asyncHandler(async (req, res) => {
  const response = res.response
  res.status(res.statusCode)
  res.send(response)
})

const userRegister = asyncHandler(async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const credential_id = req.body.credential_id

  const user = await User.findOne({ email })
  if (user) {
    res.status(402)
    res.send({
      message: 'Email is already existed',
    })
  } else if (!user && !credential_id) {
    const newUser = await User.create({
      username,
      email,
      password,
    })

    if (newUser) {
      res.status(201).send({
        username,
        email,
      })
    } else {
      res.status(406).send({
        message: 'Invalid Data',
      })
    }
  } else if (credential_id) {
    const newUser = await User.create({
      username,
      email,
      credential_id,
    })

    if (newUser) {
      res.status(201).send({
        username,
        email,
      })
    } else {
      res.status(403).send({
        message: 'Invalid Data',
      })
    }
  } else {
    res.status(401)
    res.send({
      message: 'Invalid Data',
    })
  }
})

export { userLogin, userRegister }
