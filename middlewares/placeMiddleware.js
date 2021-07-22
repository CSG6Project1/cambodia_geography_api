import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
import Place from '../models/placeModels.js'

dotenv.config()

const placeMiddleware = asyncHandler(async (req, res, next) => {})

export default placeMiddleware
