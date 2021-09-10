import express from 'express'
import {
  getBookmarkDetail, 
  deleteaplaceinBookmark, 
  addplacetoBookmark,
  emptyplaceinBookmark,
  deletemultipleplaceinBookmark
} from '../controllers/bookmarkController.js'
import authMiddleware from '../middlewares/authMiddleware.js'


const router = express.Router()


router
  .route('/')
  .get(authMiddleware, getBookmarkDetail)
  .post(authMiddleware, addplacetoBookmark)
router
  .route('/remove_place/:placeId')
  .delete(authMiddleware, deleteaplaceinBookmark)
router
  .route('/empty')
  .delete(authMiddleware, emptyplaceinBookmark)
router
  .route('/remove_places')
  .delete(authMiddleware, deletemultipleplaceinBookmark)


export default router