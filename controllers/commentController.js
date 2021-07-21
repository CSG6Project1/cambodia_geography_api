import asyncHandler from 'express-async-handler'
import Comment from '../models/commentModels.js'
import Place from '../models/placeModels.js'

const getComments = asyncHandler(async (req, res) => {
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

const createComment = asyncHandler(async (req, res) => {
  const placeId = req.body.placeId
  const comment = req.body.comment

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
    const createdComment = await Comment.create({ comment })
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
