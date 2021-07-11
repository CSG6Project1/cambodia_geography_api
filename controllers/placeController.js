import Place from '../models/placeModels.js'
import asyncHandler from 'express-async-handler'

const getPlaces = asyncHandler(async (req, res) => {
  const places = await Place.find()
  const data = {
    data: places,
    meta: {
      count: await Place.find().countDocuments(),
    },
  }
  res.status(200)
  res.send(data)
})

export { getPlaces }
