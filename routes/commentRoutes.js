import express from 'express'
import {
  deleteComment,
  updateComment,
  createComment,
  getCommentsGroupByPlace,
} from '../controllers/commentController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import Place from '../models/placeModels.js'

const router = express.Router()

router
  .route('/')
  .get(getCommentsGroupByPlace(Place))
  .post(authMiddleware, createComment)

router
  .route('/:id')
  .delete(authMiddleware, deleteComment)
  .put(authMiddleware, updateComment)

export default router
