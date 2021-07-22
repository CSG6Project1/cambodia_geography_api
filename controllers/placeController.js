import asyncHandler from 'express-async-handler'
import Comment from '../models/commentModels.js'
import Place from '../models/placeModels.js'

import cloudinary from '../config/cloudinary.js'

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
    if (place) {
      res.send({ place })
    } else {
      res.send({ message: 'Place not found' })
    }
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
      if (Object.keys(place.images).length !== 0) {
        place.images.forEach((img) => {
          cloudinary.uploader.destroy(img.image_id)
        })
      }
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

const createPlace = asyncHandler(
  async (req, res) => {
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
    } else {
      res.send({
        message: 'District code must be filled',
      })
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

    try {
      const place = await Place.create(createQuery)
      if (req.files) {
        req.files.forEach(async (file) => {
          const addImg = await Place.findById(place._id)
          cloudinary.uploader.upload(
            file.path,
            { folder: 'images' },
            async (error, result) => {
              if (error) {
                res.send({
                  message: error,
                })
                return
              } else {
                const img = {
                  image_id: result.public_id,
                  image_url: result.secure_url,
                }

                addImg.images.push(img)
                addImg.save()
              }
            }
          )
        })

        res.send({
          message: 'Place Created',
        })
      } else {
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
      }
    } catch (error) {
      res.send({
        message: error,
      })
    }
  },
  (error, req, res, next) => {
    res.send({
      message: error.message,
    })
  }
)

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
      req.body.images.forEach(async (img) => {
        const place = await Place.findByIdAndUpdate(
          id,
          { $pull: { images: { image_id: img } } },
          { new: true }
        )
        place.save()

        cloudinary.uploader.destroy(img)
      })
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
