import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import Comment from './commentModels.js'

const imageSchema = mongoose.Schema(
  {
    id: String,
    type: String,
    url: String,
  },
  { _id: false }
)

const provinceSchema = mongoose.Schema(
  {
    type: { type: String },
    khmer: { type: String },
    english: { type: String },
    province_code: { type: String, required: true },
    lat: { type: Number },
    lon: { type: Number },
    body: { type: String },
    images: [imageSchema],
    comments: [{ type: mongoose.Types.ObjectId, ref: Comment }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

provinceSchema.virtual('comment_length', {
  ref: Comment, // model to use for matching
  localField: 'comments', // from `localField` i.e., Place
  foreignField: '_id', // is equal to `foreignField` of Comment schema
  count: true, //only get the number of docs
})

provinceSchema.set('toObject', { virtuals: true })
provinceSchema.set('toJSON', { virtuals: true })

provinceSchema.plugin(normalize)

const Province = mongoose.model('Provinces', provinceSchema)

export default Province