import express from 'express'
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
import authMiddleware from '../middlewares/authMiddleware.js'
const router = express.Router()

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

router
  .route('/')
  .get(getPlaces(Place))
  .post(authMiddleware, upload.array('images', 10), createPlace)

router
  .route('/:id')
  .get(getPlaceDetail)
  .delete(authMiddleware, deletePlace)
  .put(authMiddleware, upload.array('images', 10), updatePlace)
router.route('/:id/comments').get(getComments(Place))

export default router
