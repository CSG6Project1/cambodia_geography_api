import express from 'express'
import paginatedResult from '../middlewares/placeMiddleware.js'
import { getPlaces } from '../controllers/placeController.js'
const Routes = express.Router()

Routes.get('/', getPlaces)

export default Routes
