import express from 'express'
import {
  userLogin,
  userRegister,
  userList,
  userUpdate,
  userDetail,
  userDelete,
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
router.route('/').get(authMiddleware, userDetail)
router
  .route('/:id')
  .put(authMiddleware, userUpdate)
  .delete(authMiddleware, userDelete)
router
  .route('/token')
  .post(userEmail, userCredential, userRefreshToken, userLogin)

router.post('/register', userRegister)

export default router
