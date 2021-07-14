import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'

dotenv.config()
const paginatedResult = (model, populateText) =>
  asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.per_page) || 5

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const modelLength = await model.countDocuments().exec()

    const links = {}
    let data = []
    let meta = {}

    meta.count = limit
    meta.total_count = modelLength
    meta.total_pages = Math.round(modelLength / limit)

    if (endIndex < modelLength && req.query.per_page) {
      links.self = `${process.env.HOST}/places?page=${page}&per_page=${limit}`
      if (page + 1 <= Math.round(modelLength / limit)) {
        links.next = `${process.env.HOST}/places?page=${
          page + 1
        }&per_page=${limit}`
      }

      if (page - 1 > 0) {
        links.prev = `${process.env.HOST}/places?page=${
          page - 1
        }&per_page=${limit}`
      }

      links.first = `${process.env.HOST}/places?page=1&per_page=${limit}`
      links.last = `${process.env.HOST}/places?page=${Math.round(
        modelLength / limit
      )}&per_page=${limit}`
    } else if (endIndex < modelLength) {
      links.self = `${process.env.HOST}/places?page=${page}`
      if (page + 1 <= Math.round(modelLength / limit)) {
        links.next = `${process.env.HOST}/places?page=${page + 1}`
      }

      if (page - 1 > 0) {
        links.prev = `${process.env.HOST}/places?page=${page - 1}`
      }

      links.first = `${process.env.HOST}/places?page=1`
      links.last = `${process.env.HOST}/places?page=${Math.round(
        modelLength / limit
      )}`
    }

    if (startIndex > 0 && req.query.per_page) {
      links.self = `${process.env.HOST}/places?page=${page}&per_page=${limit}`
      if (page + 1 < Math.round(modelLength / limit)) {
        links.next = `${process.env.HOST}/places?page=${
          page + 1
        }&per_page=${limit}`
      }

      if (page - 1 > 0) {
        links.prev = `${process.env.HOST}/places?page=${
          page - 1
        }&per_page=${limit}`
      }
      links.first = `${process.env.HOST}/places?page=1&per_page=${limit}`
      links.last = `${process.env.HOST}/places?page=${Math.round(
        modelLength / limit
      )}&per_page=${limit}`
    } else if (startIndex > 0) {
      links.self = `${process.env.HOST}/places?page=${page}`
      if (page + 1 < Math.round(modelLength / limit)) {
        links.next = `${process.env.HOST}/places?page=${page + 1}`
      }

      if (page - 1 > 0) {
        links.prev = `${process.env.HOST}/places?page=${page - 1}`
      }
      links.first = `${process.env.HOST}/places?page=1`
      links.last = `${process.env.HOST}/places?page=${Math.round(
        modelLength / limit
      )}`
    }

    try {
      data = populateText
        ? await model
            .find()
            .limit(limit)
            .skip(startIndex)
            .populate(populateText)
            .exec()
        : await model.find().limit(limit).skip(startIndex).exec()
      res.links = links
      res.data = data
      res.meta = meta
      next()
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

export default paginatedResult
