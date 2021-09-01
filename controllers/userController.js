import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary.js'
import bcrypt from 'bcryptjs'
import User from '../models/userModels.js'
import { generateRefreshToken, generateToken } from '../utils/generateToken.js'
import multer from 'multer'
import { storage, fileFilter } from '../config/multer.js'
import Comment from '../models/commentModels.js'
import Place from '../models/placeModels.js'
import validator from 'validator'
import admin from 'firebase-admin'

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

const singelUpload = upload.single('image')

const userLogin = asyncHandler(async (req, res) => {
  const response = res.response
  res.status(res.statusCode)
  res.send(response)
})

const userRegister = asyncHandler(async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const id_token = req.body.id_token
  const grant_type = req.body.grant_type

  if (grant_type === 'password' && !validator.isEmail(email)) {
    return res.status(403).send({
      message: "Email isn't correct format",
    })
  }

  if (grant_type === 'password') {
    const user = await User.findOne({ email })
    if (user) {
      res.status(402)
      res.send({
        message: 'Email is already existed',
      })
    } else if (!user) {
      const newUser = await User.create({
        username,
        email,
        password,
      })

      if (newUser) {
        const accessToken = generateToken(
          newUser._id,
          newUser.role,
          newUser.is_verify
        )
        const refreshToken = generateRefreshToken(
          newUser._id,
          newUser.role,
          newUser.is_verify
        )
        res.status(201).send({
          access_token: accessToken,
          refreshToken: refreshToken,
          token_type: 'Bearer',
          expires_in: 60 * 60 * 2,
          created_at: Date.now(),
        })
      } else {
        res.status(406).send({
          message: 'Invalid Data',
        })
      }
    }
  } else if (grant_type === 'credential') {
    if (id_token) {
      admin
        .auth()
        .verifyIdToken(id_token)
        .then(async (decodedToken) => {
          const uId = decodedToken.uid
          const user = await User.findOne({ credential_id: uId })
          if (user) {
            return res.status(403).send({
              message: 'This account has already registered',
            })
          }
          const newUser = await User.create({
            username,
            credential_id: uId,
            providers: decodedToken.firebase.sign_in_provider,
            is_verify: true,
          })

          if (newUser) {
            const accessToken = generateToken(
              newUser._id,
              newUser.role,
              newUser.is_verify
            )
            const refreshToken = generateRefreshToken(
              newUser._id,
              newUser.role,
              newUser.is_verify
            )
            res.status(201).send({
              access_token: accessToken,
              refreshToken: refreshToken,
              token_type: 'Bearer',
              expires_in: 60 * 60 * 2,
              created_at: Date.now(),
            })
          } else {
            res.status(403).send({
              message: 'Invalid Data',
            })
          }
        })
        .catch((error) => {
          res.status(403).send({
            message: error.message,
          })
        })
    } else {
      return res.status(403).send({
        message: 'Id Token not Found',
      })
    }
  } else {
    res.status(401)
    res.send({
      message: 'Invalid grant type',
    })
  }
})

const linkPaginate = (increase, decrease, listQuery, first, last) => {
  let base_URL = `${process.env.HOST}/api/user/all`
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
          .select('-password -credential_id')
          .limit(limit)
          .sort({ created_at: -1 })
          .skip(startIndex)
          .exec()
      } else {
        data = await User.find()
          .select('-password -credential_id')
          .limit(limit)
          .sort({ created_at: -1 })
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

const userUpdate = (req, res) => {
  singelUpload(
    req,
    res,
    asyncHandler(async (err) => {
      if (err) {
        return res.status(500).send({ message: err.message })
      }
      const jwt_role = req.role
      const jwt_id = req.id
      const userId = req.params.id
      const updateQuery = {}

      if (req.body.role && jwt_role === 'admin') {
        updateQuery.role = req.body.role
      }

      if (jwt_id !== userId && jwt_role !== 'admin') {
        return res.status(304).send({
          message: 'You can only edit your own profile',
        })
      }

      if (req.body.username) {
        updateQuery.username = req.body.username
      }

      if (req.body.old_password && req.body.new_password) {
        const user = await User.findById(jwt_id)
        if (user && (await user.matchPassword(req.body.old_password))) {
          updateQuery.password = bcrypt.hashSync(req.body.new_password, 10)
        } else {
          return res.status(304).send({
            message: 'Password is incorrect',
          })
        }
      }

      try {
        if (req.file) {
          const user = await User.findByIdAndUpdate(userId, {
            $unset: { profile_img: 1 },
          })
          user.save()
          cloudinary.uploader.destroy(user.profile_img.id)
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
  )
}

const userDelete = asyncHandler(async (req, res) => {
  const id = req.params.id
  const role = req.role

  if (role !== 'admin') {
    res.status(401).send({
      message: 'You are not admin',
    })
    return
  }

  try {
    const user = await User.findByIdAndRemove(id)
    if (user) {
      if (user.profile_img && user.profile_img.url) {
        cloudinary.uploader.destroy(user.profile_img.id)
      }

      try {
        const comments = await Comment.find({ user: user._id })
        if (comments) {
          comments.forEach(async (comment) => {
            const deleteComment = await Comment.findByIdAndRemove(comment._id)
            const place = await Place.findOne({ comments: comment._id })
            place.comments.pull({ _id: comment._id })
            place.save()
          })
        }
      } catch (error) {
        console.log(error)
      }

      res.send({
        message: 'User deleted',
      })
    } else {
      res.send({
        message: 'User not found',
      })
    }
  } catch (error) {
    res.send({
      message: error,
    })
  }
})

export { userLogin, userRegister, userList, userDetail, userUpdate, userDelete }
