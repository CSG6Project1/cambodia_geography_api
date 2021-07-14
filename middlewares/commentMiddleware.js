import asyncHandler from 'express-async-handler'

const commentResult = (model, populateText) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const page = parseInt(req.query.page) || 1
    const limit = 3

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
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
    meta.total_pages = Math.round(modelLength / limit)

    if (endIndex < modelLength) {
      links.self = `${process.env.HOST}/places/${id}/comments?page=${page}`
      if (page + 1 <= Math.round(modelLength / limit)) {
        links.next = `${process.env.HOST}/places/${id}/comments?page=${
          page + 1
        }`
      }

      if (page - 1 > 0) {
        links.prev = `${process.env.HOST}/places/${id}/comments?page=${
          page - 1
        }`
      }

      links.first = `${process.env.HOST}/places/${id}/comments?page=1`
      links.last = `${process.env.HOST}/places/${id}/comments?page=${Math.round(
        modelLength / limit
      )}`
    }

    if (startIndex > 0) {
      links.self = `${process.env.HOST}/places/${id}/comments?page=${page}`
      if (page + 1 < Math.round(modelLength / limit)) {
        links.next = `${process.env.HOST}/places/${id}/comments?page=${
          page + 1
        }`
      }

      if (page - 1 > 0) {
        links.prev = `${process.env.HOST}/places/${id}/comments?page=${
          page - 1
        }`
      }
      links.first = `${process.env.HOST}/places/${id}/comments?page=1`
      links.last = `${process.env.HOST}/places/${id}/comments?page=${Math.round(
        modelLength / limit
      )}`
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
