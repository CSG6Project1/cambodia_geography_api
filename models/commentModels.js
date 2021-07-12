import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
  type: { type: String },
  khmer: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
})

// Duplicate the ID field.
commentSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Ensure virtual fields are serialised.
commentSchema.set('toJSON', {
  virtuals: true,
})

const Comment = mongoose.model('Comments', commentSchema)

export default Comment
