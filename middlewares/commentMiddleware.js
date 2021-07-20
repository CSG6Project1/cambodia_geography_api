import asyncHandler from 'express-async-handler'

const linkPaginate = (id, increase, decrease, listQuery, first, last) => {
  let base_URL = `${process.env.HOST}/places/${id}/comments`
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

const commentResult = (model, populateText) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.per_page) || 5

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const listQuery = []
    let modelLength = 0
    const modelQuery = await model.findById(id).select('comments -_id').exec()

    modelQuery.comments.map(() => {
      modelLength += 1
    })

    const links = {}
    let data = []
    let meta = {}

    meta.count = limit
    meta.total_count = modelLength
    meta.total_pages = Math.ceil(modelLength / limit)

    if (req.query.per_page) {
      listQuery.push(
        { name: 'page', value: page },
        { name: 'per_page', value: limit }
      )
    } else {
      listQuery.push({ name: 'page', value: page })
    }

    if (endIndex < modelLength) {
      links.self = linkPaginate(id, false, false, listQuery, false, false)
      if (page + 1 <= Math.ceil(modelLength / limit)) {
        links.next = linkPaginate(id, true, false, listQuery, false, false)
      }

      if (page - 1 > 0) {
        links.prev = linkPaginate(id, false, true, listQuery, false, false)
      }

      links.first = linkPaginate(id, false, false, listQuery, true, false)
      links.last = linkPaginate(
        id,
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    }

    if (startIndex > 0) {
      links.self = linkPaginate(id, false, false, listQuery, false, false)
      if (page + 1 < Math.ceil(modelLength / limit)) {
        links.next = linkPaginate(id, true, false, listQuery, false, false)
      }

      if (page - 1 > 0) {
        links.prev = linkPaginate(id, false, true, listQuery, false, false)
      }
      links.first = linkPaginate(id, false, false, listQuery, true, false)
      links.last = linkPaginate(
        id,
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    }

    try {
      data = await model
        .findById(id)
        .select('comments -_id')
        .populate({
          path: 'comments',
          options: {
            limit,
            skip: startIndex,
          },
        })
        .exec()
      res.links = links
      res.data = data.comments
      res.meta = meta
      next()
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

export default commentResult
