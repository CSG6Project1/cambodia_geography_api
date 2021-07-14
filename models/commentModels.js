import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'

const commentSchema = mongoose.Schema({
  type: { type: String },
  khmer: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
})

commentSchema.plugin(normalize)

const Comment = mongoose.model('Comments', commentSchema)

export default Comment
