import express from 'express'
import userLogin from '../controllers/userController.js'
import {
  userEmail,
  userCredential,
  userRefreshToken,
} from '../middlewares/userMiddleware.js'

const router = express.Router()

router
  .route('/token')
  .post(userEmail, userCredential, userRefreshToken, userLogin)

export default router
