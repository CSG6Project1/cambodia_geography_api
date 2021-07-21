import express from 'express'
import {
  deleteComment,
  updateComment,
  createComment,
} from '../controllers/commentController.js'

const router = express.Router()

router.route('/').post(createComment)
router.route('/:id').delete(deleteComment).put(updateComment)

export default router
