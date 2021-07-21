import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'

dotenv.config()

const linkPaginate = (increase, decrease, listQuery, first, last) => {
  let base_URL = `${process.env.HOST}/places`
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

const paginatedResult = (model, populateText) =>
  asyncHandler(async (req, res, next) => {
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
          .skip(startIndex)
          .populate({ path: 'comment_length', count: true })
          .exec()
      } else if (province_code && !type) {
        data = await model
          .find({ province_code })
          .limit(limit)
          .skip(startIndex)
          .populate({ path: 'comment_length', count: true })
          .exec()
      } else if (!province_code && type) {
        data = await model
          .find({ type })
          .limit(limit)
          .skip(startIndex)
          .populate({ path: 'comment_length', count: true })
          .exec()
      } else {
        data = await model
          .find({ province_code, type })
          .limit(limit)
          .skip(startIndex)
          .populate({ path: 'comment_length', count: true })
          .exec()
      }

      res.links = links
      res.data = data
      res.meta = meta
      next()
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

export default paginatedResult
