import express from 'express'
import {
  userLogin,
  userRegister,
  userList,
  userUpdate,
} from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  userEmail,
  userCredential,
  userRefreshToken,
} from '../middlewares/userMiddleware.js'
import User from '../models/userModels.js'
import multer from 'multer'
import { storage, fileFilter } from '../config/multer.js'

const router = express.Router()

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

router.route('/all').get(authMiddleware, userList(User))
router.route('/').put(authMiddleware, upload.single('image'), userUpdate)
router
  .route('/token')
  .post(userEmail, userCredential, userRefreshToken, userLogin)

router.post('/register', userRegister)

export default router
