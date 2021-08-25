import asyncHandler from 'express-async-handler'
import Comment from '../models/commentModels.js'
import Place from '../models/placeModels.js'

const linkPaginate = (id, increase, decrease, listQuery, first, last) => {
  let base_URL = `${process.env.HOST}/api/places/${id}/comments`
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

const linkPaginateGroupBy = (increase, decrease, listQuery, first, last) => {
  let base_URL = `${process.env.HOST}/api/comment`
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

const getCommentsGroupByPlace = (model) =>
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
      links.self = linkPaginateGroupBy(false, false, listQuery, false, false)
      links.first = linkPaginateGroupBy(false, false, listQuery, true, false)
      links.last = linkPaginateGroupBy(
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    }

    if (endIndex < modelLength) {
      links.self = linkPaginateGroupBy(false, false, listQuery, false, false)
      if (page + 1 <= Math.ceil(modelLength / limit)) {
        links.next = linkPaginateGroupBy(true, false, listQuery, false, false)
      }

      if (page - 1 > 0) {
        links.prev = linkPaginateGroupBy(false, true, listQuery, false, false)
      }

      links.first = linkPaginateGroupBy(false, false, listQuery, true, false)
      links.last = linkPaginateGroupBy(
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    } else if (endIndex > modelLength) {
      links.self = linkPaginateGroupBy(false, false, listQuery, false, false)
      links.first = linkPaginateGroupBy(false, false, listQuery, true, false)
      links.last = linkPaginateGroupBy(
        false,
        false,
        listQuery,
        false,
        Math.ceil(modelLength / limit)
      )
    }

    if (startIndex > 0) {
      links.self = linkPaginateGroupBy(false, false, listQuery, false, false)
      if (page + 1 < Math.ceil(modelLength / limit)) {
        links.next = linkPaginateGroupBy(true, false, listQuery, false, false)
      }

      if (page - 1 > 0) {
        links.prev = linkPaginateGroupBy(false, true, listQuery, false, false)
      }
      links.first = linkPaginateGroupBy(false, false, listQuery, true, false)
      links.last = linkPaginateGroupBy(
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
            path: 'comments',
            populate: {
              path: 'user',
              select: { _id: 1, username: 1, profile_img: 1 },
            },
          })
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
            path: 'comments',
            populate: {
              path: 'user',
              select: { _id: 1, username: 1, profile_img: 1 },
            },
          })
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
            path: 'comments',
            populate: {
              path: 'user',
              select: { _id: 1, username: 1, profile_img: 1 },
            },
          })
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
            path: 'comments',
            populate: {
              path: 'user',
              select: { _id: 1, username: 1, profile_img: 1 },
            },
          })
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

const getComments = (model) =>
  asyncHandler(async (req, res) => {
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

    if (endIndex === modelLength) {
      links.self = linkPaginate(id, false, false, listQuery, false, false)
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
    } else if (endIndex > modelLength) {
      links.self = linkPaginate(id, false, false, listQuery, false, false)
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
      if (startIndex === 0) {
        data = await model
          .findById(id)
          .select('comments -_id')
          .populate({
            path: 'comments',
            options: {
              limit,
            },
            populate: {
              path: 'user',
              select: { _id: 1, username: 1, profile_img: 1 },
            },
          })
          .exec()
      } else {
        data = await model
          .findById(id)
          .select('comments -_id')
          .populate({
            path: 'comments',

            options: {
              limit,
              skip: startIndex,
            },
            populate: {
              path: 'user',
              select: { _id: 1, username: 1, profile_img: 1 },
            },
          })
          .exec()
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
    const response = {
      data: data.comments,
      meta,
      links,
    }
    res.status(200)
    res.send(response)
  })

const createComment = asyncHandler(async (req, res) => {
  const placeId = req.body.placeId
  const comment = req.body.comment
  const userId = req.id

  if (!placeId) {
    res.send({
      message: 'Place Id not found',
    })
  } else if (!comment) {
    res.send({
      message: 'comment is null',
    })
  }

  try {
    const createdComment = await Comment.create({ user: userId, comment })
    if (createdComment) {
      const place = await Place.findByIdAndUpdate(placeId)
      place.comments.push(createdComment._id)
      place.save()
      res.send({
        message: 'Comment created',
      })
    } else {
      res.send({
        message: 'Cant create comment',
      })
    }
  } catch (error) {
    res.send({
      message: 'Place not found',
    })
  }
})

const updateComment = asyncHandler(async (req, res) => {
  const id = req.params.id
  const comment = req.body.comment
  const userId = req.id
  const cmt = await Comment.findById(id)

  if (cmt.user.toString() !== userId) {
    res.send({
      message: 'You can only update your own comment',
    })
    return
  }

  if (!comment) {
    res.send({
      message: 'Comment is null',
    })
  }

  try {
    await Comment.findByIdAndUpdate(id, { comment })
    res.send({
      message: 'Comment updated',
    })
  } catch (error) {
    res.send({
      message: 'Comment not updated',
    })
  }
})

const deleteComment = asyncHandler(async (req, res) => {
  const id = req.params.id
  const jwt_id = req.id
  const jwt_role = req.role
  try {
    const ownComment = await Comment.findOne({ _id: id, user: jwt_id })
    if (!ownComment && jwt_role !== 'admin') {
      return res.send({
        message: 'You can only delete your own comment',
      })
    }
  } catch (error) {
    return res.send({ message: 'Invalid Id' })
  }

  const place = await Place.findOne({ comments: { $in: id } })
  const placeId = place.id
  if (!placeId) {
    return res.send({
      message: 'place not found',
    })
  }

  try {
    const deletedComment = await Comment.findByIdAndRemove(id)
    if (deletedComment) {
      const place = await Place.findByIdAndUpdate(placeId)
      place.comments.pull({ _id: id })
      place.save()
      res.send({
        message: 'Comment deleted',
      })
    } else {
      res.send({
        message: 'Comment not found or Place not found',
      })
    }
  } catch (error) {
    res.send({
      message: 'Comment not deleted',
    })
  }
})

export {
  getCommentsGroupByPlace,
  getComments,
  deleteComment,
  updateComment,
  createComment,
}
