import asyncHandler from 'express-async-handler'
import Comment from '../models/commentModels.js'
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

const deletePlace = asyncHandler(async (req, res) => {
  const id = req.params.id

  try {
    const place = await Place.findByIdAndRemove(id)
    if (place) {
      await place.comments.map(async (comment) => {
        await Comment.findByIdAndRemove(comment)
      })
      res.send({
        message: 'Place deleted',
      })
    } else {
      res.send({
        message: 'Place not found',
      })
    }
  } catch (error) {
    res.send({
      message: error,
    })
  }
})

export { getPlaces, getPlaceDetail, deletePlace }
