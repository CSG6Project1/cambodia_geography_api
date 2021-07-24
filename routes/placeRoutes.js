import express from 'express'
import Place from '../models/placeModels.js'
import Comment from '../models/commentModels.js'

import {
  getPlaces,
  getPlaceDetail,
  createPlace,
  deletePlace,
  updatePlace,
} from '../controllers/placeController.js'
import { getComments } from '../controllers/commentController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
const router = express.Router()

router.route('/').get(getPlaces(Place)).post(authMiddleware, createPlace)

router
  .route('/:id')
  .get(getPlaceDetail)
  .delete(authMiddleware, deletePlace)
  .put(authMiddleware, updatePlace)
router.route('/:id/comments').get(getComments(Place))

export default router
