import express from 'express'
import { userLogin, userRegister } from '../controllers/userController.js'
import {
  userEmail,
  userCredential,
  userRefreshToken,
} from '../middlewares/userMiddleware.js'

const router = express.Router()

router
  .route('/token')
  .post(userEmail, userCredential, userRefreshToken, userLogin)

router.post('/register', userRegister)

export default router
