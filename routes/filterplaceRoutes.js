import express from 'express'
import fuzzysearch from 'fuzzy-search'
import Place from '../models/placeModels.js'
import { getFilterPlaces } from '../controllers//filterplaceController.js'
const router = express.Router()

//link: filterplaces/result?type=&province_code=&district_code=&commune_code=&village_code=

router.get("/result",getFilterPlaces(Place));

export default router
