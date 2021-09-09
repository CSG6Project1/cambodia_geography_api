import express from 'express'
import {
  getBookmarkDetail, 
  deleteplaceinBookmark, 
  addplacetoBookmark
} from '../controllers/bookmarkController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import Place from '../models/placeModels.js'

const router = express.Router()


router
  .route('/')
  .get(authMiddleware, getBookmarkDetail)
  .delete(authMiddleware, deleteplaceinBookmark)
  .post(authMiddleware, addplacetoBookmark)

export default router