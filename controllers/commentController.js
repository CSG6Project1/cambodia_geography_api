import asyncHandler from 'express-async-handler'
import Comment from '../models/commentModels.js'
import Place from '../models/placeModels.js'

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
  const userId = req.userId

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
  const userId = req.userId
  const cmt = await Comment.findById(id)

  if (cmt.user !== userId) {
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
  const placeId = req.body.placeId
  const userId = req.userId

  const comment = await Comment.findById(id)

  if (comment.user !== userId) {
    res.send({
      message: 'You can only delete your own comment',
    })
    return
  }

  if (!placeId) {
    res.send({
      message: 'Place not found',
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

export { getComments, deleteComment, updateComment, createComment }
