import asyncHandler from 'express-async-handler'
import Comment from '../models/commentModels.js'
import Place from '../models/placeModels.js'

import cloudinary from '../config/cloudinary.js'
import multer from 'multer'
import { storage, fileFilter } from '../config/multer.js'

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

const uploadImage = upload.array('images', 10)

const linkPaginate = (increase, decrease, listQuery, first, last) => {
  let base_URL = `${process.env.HOST}/api/places`
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

const getPlaces = (model) =>
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.per_page) || 5
    const province_code = req.query.province_code
    const type = req.query.type
    const listQuery = []
    let modelLength = ''

    if (province_code && type) {
      modelLength = await model.countDocuments({ province_code, type }).exec()
      listQuery.push(
        { name: 'province_code', value: province_code },
        { name: 'type', value: type },
        { name: 'page', value: page }
      )
    } else if (province_code && !type) {
      modelLength = await model.countDocuments({ province_code }).exec()
      listQuery.push(
        { name: 'province_code', value: province_code },
        { name: 'page', value: page }
      )
    } else if (!province_code && type) {
      modelLength = await model.countDocuments({ type }).exec()
      listQuery.push(
        { name: 'type', value: type },
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
      if (!province_code && !type) {
        data = await model
          .find()
          .limit(limit)
          .sort({ created_at: -1 })
          .skip(startIndex)
          .populate({
            path: 'comment_length',
            count: true,
          })
          .exec()
      } else if (province_code && !type) {
        data = await model
          .find({ province_code })
          .limit(limit)
          .sort({ created_at: -1 })
          .skip(startIndex)
          .populate({
            path: 'comment_length',
            count: true,
          })
          .exec()
      } else if (!province_code && type) {
        data = await model
          .find({ type })
          .limit(limit)
          .sort({ created_at: -1 })
          .skip(startIndex)
          .populate({
            path: 'comment_length',
            count: true,
          })
          .exec()
      } else {
        data = await model
          .find({ province_code, type })
          .limit(limit)
          .sort({ created_at: -1 })
          .skip(startIndex)
          .populate({
            path: 'comment_length',
            count: true,
          })
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
  const role = req.role

  if (role !== 'admin') {
    res.status(401).send({
      message: 'You are not admin',
    })
    return
  }

  try {
    const place = await Place.findById(id)
    
    if(place.type == "province"){
      res.send({
        message: 'Can\'t delete province, Please delete them manually in mongodb.',
      })
      return
    }

    if (place) {
      place = await Place.findByIdAndDelete(id)
      if (Object.keys(place.images).length !== 0) {
        place.images.forEach((img) => {
          cloudinary.uploader.destroy(img.id)
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

const createPlace = (req, res) => {
  uploadImage(
    req,
    res,
    asyncHandler(async (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(500)
          .send({ message: 'You can upload only 10 images' })
      } else if (err) {
        return res.status(500).send({ message: err.message })
      }
      const createQuery = {}

      const role = req.role

      if (role !== 'admin') {
        res.status(401).send({
          message: 'You are not admin',
        })
        return
      }

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
      } else {
        res.send({
          message: 'Province code must be filled',
        })
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
                    type: 'image',
                    id: result.public_id,
                    url: result.secure_url,
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
        }
      } catch (error) {
        res.send({
          message: error,
        })
      }
    })
  )
}

const updatePlace = (req, res) => {
  uploadImage(
    req,
    res,
    asyncHandler(async (err) => {
      if (err) {
        return res.status(500).send({ message: err.message })
      }

      const id = req.params.id
      const updateQuery = {}
      const role = req.role

      if (role !== 'admin') {
        res.status(401).send({
          message: 'You are not admin',
        })
        return
      }

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
        if (req.body.removeImages) {
          const images = JSON.parse(req.body.removeImages)

          images.forEach(async (img) => {
            const place = await Place.findByIdAndUpdate(
              id,
              { $pull: { images: { id: img } } },
              { new: true }
            )
            place.save()
            cloudinary.uploader.destroy(img)
          })
        }

        if (req.files) {
          req.files.forEach(async (file) => {
            const updatePlace = await Place.findById(id)
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
                    type: 'image',
                    id: result.public_id,
                    url: result.secure_url,
                  }

                  updatePlace.images.push(img)
                  updatePlace.save()
                }
              }
            )
          })

          const place = await Place.findByIdAndUpdate(id, updateQuery, {
            new: true,
          })
          res.send({
            message: 'Place updated',
          })
        } else {
          const place = await Place.findByIdAndUpdate(id, updateQuery, {
            new: true,
          })

          res.send({
            message: 'Place Updated',
          })
        }
      } catch (error) {
        res.send({
          message: error,
        })
      }
    })
  )
}

export { getPlaces, getPlaceDetail, deletePlace, updatePlace, createPlace }
