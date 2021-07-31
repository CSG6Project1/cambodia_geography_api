import express from 'express'
import {
  userLogin,
  userRegister,
  userList,
  userUpdate,
  userDetail,
} from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  userEmail,
  userCredential,
  userRefreshToken,
} from '../middlewares/userMiddleware.js'
import User from '../models/userModels.js'

const router = express.Router()

router.route('/all').get(authMiddleware, userList(User))
router
  .route('/')
  .put(authMiddleware, userUpdate)
  .get(authMiddleware, userDetail)
router
  .route('/token')
  .post(userEmail, userCredential, userRefreshToken, userLogin)

router.post('/register', userRegister)

export default router
