import express from 'express'
import paginatedResult from '../middlewares/placeMiddleware.js'
import commentResult from '../middlewares/commentMiddleware.js'
import Place from '../models/placeModels.js'
import Comment from '../models/commentModels.js'
import multer from 'multer'
import { storage, fileFilter } from '../config/multer.js'
import {
  getPlaces,
  getPlaceDetail,
  createPlace,
  deletePlace,
  updatePlace,
} from '../controllers/placeController.js'
import { getComments } from '../controllers/commentController.js'
const router = express.Router()

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

router
  .route('/')
  .get(getPlaces(Place))
  .post(upload.array('images', 10), createPlace)

router.route('/:id').get(getPlaceDetail).delete(deletePlace).put(updatePlace)
router.route('/:id/comments').get(getComments(Place))

export default router
