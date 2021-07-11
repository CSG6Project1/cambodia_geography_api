import mongoose from 'mongoose'

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
  comments: [{ type: String }],
})

// Duplicate the ID field.
placeSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Ensure virtual fields are serialised.
placeSchema.set('toJSON', {
  virtuals: true,
})

const Place = mongoose.model('places', placeSchema)

export default Place
