import express from 'express'
import paginatedResult from '../middlewares/placeMiddleware.js'
import commentResult from '../middlewares/commentMiddleware.js'
import Place from '../models/placeModels.js'
import Comment from '../models/commentModels.js'
import {
  getPlaces,
  getPlaceDetail,
  deletePlace,
} from '../controllers/placeController.js'
import { getComments } from '../controllers/commentController.js'
const router = express.Router()

router
  .route('/')
  .get(paginatedResult(Place, 'comments'), getPlaces)
  .delete(deletePlace)
router.route('/:id').get(getPlaceDetail)
router.route('/:id/comments').get(commentResult(Place, 'comments'), getComments)

export default router
