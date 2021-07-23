import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary.js'
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

const linkPaginate = (increase, decrease, listQuery, first, last) => {
  let base_URL = `${process.env.HOST}/user/all`
  let sign = '?'
  listQuery.forEach((q, index) => {
    if (index !== 0) sign = '&'
    if (increase && q.name === 'page') {
      base_URL += `${sign}${q.name}=${q.value + 1}`
    } else if (first && q.name === 'page') {
      base_URL += `${sign}${q.name}=1`
    } else if (last && q.name === 'page') {
      base_URL += `${sign}${q.name}=${last}`
    } else if (decrease && q.name === 'page') {
      base_URL += `${sign}${q.name}=${q.value - 1}`
    } else {
      base_URL += `${sign}${q.name}=${q.value}`
    }
  })
  return base_URL
}

const userList = (model) =>
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.per_page) || 5
    const filter = req.query.filter
    const listQuery = []
    let modelLength = ''
    const role = req.role
    if (role !== 'admin') {
      res.send({
        message: 'User is not allowed',
      })
      return
    }

    if (filter) {
      modelLength = await model.countDocuments({ role: filter }).exec()
      listQuery.push(
        { name: 'filter', value: filter },
        { name: 'page', value: page }
      )
    } else {
      modelLength = await model.countDocuments().exec()
      listQuery.push({ name: 'page', value: page })
    }

    if (req.query.per_page) {
      listQuery.push({ name: 'per_page', value: limit })
    }

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    let links = {}
    let data = []
    let meta = {}

    meta.count = limit
    meta.total_count = modelLength
    meta.total_pages = Math.ceil(modelLength / limit)

    if (endIndex === modelLength) {
      links.self = linkPaginate(false, false, listQuery, false, false)
      links.first = linkPaginate(false, false, listQuery, true, false)
      links.last = linkPaginate(
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    }

    if (endIndex < modelLength) {
      links.self = linkPaginate(false, false, listQuery, false, false)
      if (page + 1 <= Math.ceil(modelLength / limit)) {
        links.next = linkPaginate(true, false, listQuery, false, false)
      }

      if (page - 1 > 0) {
        links.prev = linkPaginate(false, true, listQuery, false, false)
      }

      links.first = linkPaginate(false, false, listQuery, true, false)
      links.last = linkPaginate(
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    } else if (endIndex > modelLength) {
      links.self = linkPaginate(false, false, listQuery, false, false)
      links.first = linkPaginate(false, false, listQuery, true, false)
      links.last = linkPaginate(
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    }

    if (startIndex > 0) {
      links.self = linkPaginate(false, false, listQuery, false, false)
      if (page + 1 < Math.ceil(modelLength / limit)) {
        links.next = linkPaginate(true, false, listQuery, false, false)
      }

      if (page - 1 > 0) {
        links.prev = linkPaginate(false, true, listQuery, false, false)
      }
      links.first = linkPaginate(false, false, listQuery, true, false)
      links.last = linkPaginate(
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    }
    try {
      if (filter) {
        data = await User.find({ role: filter })
          .select('-password -email -credential_id')
          .limit(limit)
          .skip(startIndex)
          .exec()
      } else {
        data = await User.find()
          .select('-password -email -credential_id')
          .limit(limit)
          .skip(startIndex)
          .exec()
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }

    const response = {
      data: data,
      meta,
      links,
    }
    res.status(200)
    res.send(response)
  })

const userDetail = asyncHandler(async (req, res) => {
  const userId = req.id

  const user = await User.findById(userId).select('-password -credential_id')

  res.send({
    data: user,
  })
})

const userUpdate = asyncHandler(async (req, res) => {
  const jwt_role = req.role
  const userId = req.body.userId
  const updateQuery = {}

  if (req.body.role && jwt_role === 'admin') {
    updateQuery.role = req.body.role
  }

  if (!req.body.userId) {
    res.send({
      message: 'Provide userId to update',
    })
  }

  if (req.body.username) {
    updateQuery.username = req.body.username
  }

  try {
    if (req.body.removeImages) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $unset: { profile_img: 1 },
        },
        { new: true }
      )
      user.save()
      cloudinary.uploader.destroy(req.body.removeImages)
    }

    if (req.file) {
      cloudinary.uploader.upload(
        req.file.path,
        { folder: 'images' },
        async (error, result) => {
          if (error) {
            res.send({
              message: error,
            })
            return
          } else {
            updateQuery.profile_img = {
              type: 'image',
              id: result.public_id,
              url: result.secure_url,
            }

            const user = await User.findByIdAndUpdate(userId, updateQuery, {
              new: true,
            })

            user.save()
          }
        }
      )
    } else {
      const user = await User.findByIdAndUpdate(userId, updateQuery, {
        new: true,
      })
      user.save()
    }

    res.send({
      message: 'User updated',
    })
  } catch (error) {
    res.send({
      message: error,
    })
  }
})

export { userLogin, userRegister, userList, userDetail, userUpdate }
