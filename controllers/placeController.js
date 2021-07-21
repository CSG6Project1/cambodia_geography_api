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

const createPlace = asyncHandler(async (req, res) => {
  const createQuery = {}

  if (req.body.type) {
    createQuery.type = req.body.type
  }
  if (req.body.english) {
    createQuery.english = req.body.english
  }
  if (req.body.khmer) {
    createQuery.khmer = req.body.khmer
  }
  if (req.body.province_code) {
    createQuery.province_code = req.body.province_code
  }
  if (req.body.district_code) {
    createQuery.district_code = req.body.district_code
  }
  if (req.body.commune_code) {
    createQuery.commune_code = req.body.commune_code
  }
  if (req.body.village_code) {
    createQuery.village_code = req.body.village_code
  }
  if (req.body.lat) {
    createQuery.lat = req.body.lat
  }
  if (req.body.lon) {
    createQuery.lon = req.body.lon
  }
  if (req.body.body) {
    createQuery.body = req.body.body
  }

  if (req.body.images) {
    createQuery.images = req.body.images
  }

  try {
    const place = await Place.create(createQuery)
    if (place) {
      res.send({
        message: 'Place created',
      })
    } else {
      res.send({
        message: 'Place not created',
      })
    }
  } catch (error) {
    res.send({
      message: 'Discrict code must be fill',
    })
  }
})

const updatePlace = asyncHandler(async (req, res) => {
  const id = req.params.id
  const updateQuery = {}

  if (req.body.type) {
    updateQuery.type = req.body.type
  }
  if (req.body.english) {
    updateQuery.english = req.body.english
  }
  if (req.body.khmer) {
    updateQuery.khmer = req.body.khmer
  }
  if (req.body.province_code) {
    updateQuery.province_code = req.body.province_code
  }
  if (req.body.district_code) {
    updateQuery.district_code = req.body.district_code
  }
  if (req.body.commune_code) {
    updateQuery.commune_code = req.body.commune_code
  }
  if (req.body.village_code) {
    updateQuery.village_code = req.body.village_code
  }
  if (req.body.lat) {
    updateQuery.lat = req.body.lat
  }
  if (req.body.lon) {
    updateQuery.lon = req.body.lon
  }
  if (req.body.body) {
    updateQuery.body = req.body.body
  }

  try {
    const place = await Place.findByIdAndUpdate(id, updateQuery, { new: true })
    if (req.body.images) {
      req.body.images.map((img) => {
        place.images.pull(img)
      })

      place.save()
    }

    if (place) {
      res.send({
        message: 'Place updated',
      })
    } else {
      res.send({
        message: 'Place not updated',
      })
    }
  } catch (error) {
    res.send({
      message: error,
    })
  }
})

export { getPlaces, getPlaceDetail, deletePlace, updatePlace, createPlace }
