import Place from '../models/placeModels.js'
import asyncHandler from 'express-async-handler'

const getPlaces = asyncHandler(async (req, res) => {
  const places = await Place.find()
  const links = res.links
  const data = res.data
  const response = {
    data: data,
    meta: {
      count: await Place.find().countDocuments(),
    },
    links,
  }
  res.status(200)
  res.send(response)
})

export { getPlaces }
