import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import User from './userModels.js'
import Place from './placeModels.js'

const bookmarkSchema = mongoose.Schema(
  {
    type: { type: String, default: 'bookmark' },
    user: { type: mongoose.Types.ObjectId, ref: User },
    places: [{ type: mongoose.Types.ObjectId, ref: Place}],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

bookmarkSchema.virtual('place_length', {
    ref: Place, // model to use for matching
    localField: 'places', // from `localField` i.e., Place
    foreignField: '_id', // is equal to `foreignField` of Place schema
    count: true, //only get the number of docs
  })

bookmarkSchema.set('toObject', { virtuals: true })
bookmarkSchema.set('toJSON', { virtuals: true })
  

bookmarkSchema.plugin(normalize)

const Bookmark = mongoose.model('Bookmarks', bookmarkSchema)

export default Bookmark
