import express from 'express'
import paginatedResult from '../middlewares/paginateMiddleware.js'
import Place from '../models/placeModels.js'
import { getPlaces } from '../controllers/placeController.js'
const Routes = express.Router()

Routes.get('/', paginatedResult(Place), getPlaces)

export default Routes
