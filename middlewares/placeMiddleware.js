import asyncHandler from 'express-async-handler'
const paginatedResult = asyncHandler(async (req, res, next, model) => {
  const page = parseInt(req.query.page)
  const limit = 5
  // 5
  // 10

  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const modelLength = await model.countDocuments

  const links = {}

  if (endIndex < modelLength) {
    links.self = `http://localhost:5000/places?page=${page}`
    if (page + 1 > modelLength / limit) {
      links.next = `http://localhost:5000/places?page=${page + 1}`
    }

    if (page - 1 > 0) {
      links.prev = `http://localhost:5000/places?page=${page - 1}`
    }

    links.first = `http://localhost:5000/places?page=1`
    links.last = `http://localhost:5000/places?page=${modelLength / limit}`
  }

  if (startIndex > 0) {
    links.self = `http://localhost:5000/places?page=${page}`
    if (page + 1 > modelLength / limit) {
      links.next = `http://localhost:5000/places?page=${page + 1}`
    }

    if (page - 1 > 0) {
      links.prev = `http://localhost:5000/places?page=${page - 1}`
    }
    links.first = `http://localhost:5000/places?page=1`
    links.last = `http://localhost:5000/places?page=${modelLength / limit}`
  }

  try {
    links.links = await model.find().limit(limit).skip(startIndex).exec()
    res.links = links
    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default paginatedResult
