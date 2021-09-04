import express from 'express'
import {
  addSocialLinkages,
  deleteSocialLinkages,
} from '../controllers/socialLinkagesController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(authMiddleware, addSocialLinkages)

router.route('/:provider').delete(authMiddleware, deleteSocialLinkages)

export default router
