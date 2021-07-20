import asyncHandler from 'express-async-handler'
import Place from '../models/placeModels.js'

const getPlaces = asyncHandler(async (req, res) => {
  const links = res.links
  const data = res.data
  const meta = res.meta
  const response = {
    data: data,
    meta,
    links,
  }
  res.status(200)
  res.send(response)
})

const getPlaceDetail = asyncHandler(async (req, res) => {
  const id = req.params.id
  if (!id) {
    res.send({
      message: 'Id not found',
    })
    return
  }
  try {
    const place = await Place.findById(id).populate('comments')
    res.send({ place })
    return
  } catch (error) {
    res.send({
      message: 'Place not found Invalid Id',
    })
    return
  }
})

export { getPlaces, getPlaceDetail }
