import express from 'express'
import asyncHandler from 'express-async-handler'
import Comment from '../models/commentModels.js'
import Place from '../models/placeModels.js'
import User from '../models/userModels.js'

const router = express.Router()

router.route('/').get(
  asyncHandler(async (req, res) => {
    const users = await User.countDocuments()
    const place = await Place.countDocuments({ type: 'place' })
    const restaurant = await Place.countDocuments({ type: 'restaurant' })
    const provinces = await Place.countDocuments({ type: 'province' })
    const comments = await Comment.countDocuments()
    const totalPlaces = place + restaurant

    return res.send({
      data: {
        places: totalPlaces,
        users,
        provinces,
        comments,
      },
    })
  })
)

export default router
