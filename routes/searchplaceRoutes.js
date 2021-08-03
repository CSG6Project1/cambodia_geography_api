import express from 'express'
import fuzzysearch from 'fuzzy-search'
import Place from '../models/placeModels.js'
import {
    getPlaces,
  } from '../controllers/searchplaceControllers.js'
const router = express.Router()

///searchplaces/result?keyword=

router.get("/result",getPlaces(Place));

export default router




