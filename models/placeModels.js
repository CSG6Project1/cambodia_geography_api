import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import Comment from './commentModels.js'

const placeSchema = mongoose.Schema({
  type: { type: String },
  khmer: { type: String },
  english: { type: String },
  province_code: { type: String },
  district_code: { type: String, required: true },
  commune_code: { type: String },
  village_code: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  body: { type: String, required: true },
  images: [{ type: String }],
  comments: [{ type: mongoose.Types.ObjectId, ref: Comment }],
})

placeSchema.plugin(normalize)

const Place = mongoose.model('Places', placeSchema)

export default Place
