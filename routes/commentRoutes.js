import express from 'express'
import {
  deleteComment,
  updateComment,
  createComment,
} from '../controllers/commentController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(authMiddleware, createComment)
router
  .route('/:id')
  .delete(authMiddleware, deleteComment)
  .put(authMiddleware, updateComment)

export default router
