import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import Comment from './commentModels.js'

const placeSchema = mongoose.Schema(
  {
    type: { type: String },
    khmer: { type: String },
    english: { type: String },
    province_code: { type: String },
    district_code: { type: String, required: true },
    commune_code: { type: String },
    village_code: { type: String },
    lat: { type: Number },
    lon: { type: Number },
    body: { type: String },
    images: [{ type: String }],
    comments: [{ type: mongoose.Types.ObjectId, ref: Comment }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

placeSchema.plugin(normalize)

placeSchema.virtual('comment_length', {
  ref: Comment, // model to use for matching
  localField: 'comments', // from `localField` i.e., Place
  foreignField: '_id', // is equal to `foreignField` of Comment schema
  count: true, //only get the number of docs
})

placeSchema.set('toObject', { virtuals: true })
placeSchema.set('toJSON', { virtuals: true })

const Place = mongoose.model('Places', placeSchema)

export default Place
