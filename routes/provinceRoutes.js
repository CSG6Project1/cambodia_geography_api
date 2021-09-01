import express from 'express'
import Province from '../models/provinceModels.js'
import Comment from '../models/commentModels.js'


import {
    getProvinces,
    getProvinceDetail,
    deleteProvince,
    updateProvince,
    createProvince
} from '../controllers/provinceController.js'
import { getComments } from '../controllers/commentController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
const router = express.Router()

router.route('/').get(getProvinces(Province)).post(authMiddleware, createProvince)

router
  .route('/:id')
  .get(getProvinceDetail)
  .delete(authMiddleware, deleteProvince)
  .put(authMiddleware, updateProvince)
router.route('/:id/comments').get(getComments(Province))

export default router
