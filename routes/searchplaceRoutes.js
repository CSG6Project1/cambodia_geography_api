import express from 'express'
import fuzzysearch from 'fuzzy-search'
import Place from '../models/placeModels.js'
import { getSearchPlaces } from '../controllers/searchplaceControllers.js'
const router = express.Router()

///searchplaces/result?keyword=

router.get('/result', getSearchPlaces(Place))

export default router
