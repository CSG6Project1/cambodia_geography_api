import express from 'express'
import {
  sendVerification,
  verifyVerification,
} from '../controllers/verificationController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/:token').get(verifyVerification)
router.route('/').post(authMiddleware, sendVerification)

export default router
