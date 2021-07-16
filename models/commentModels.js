import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import User from './userModels.js'

const commentSchema = mongoose.Schema(
  {
    type: { type: String },
    khmer: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: User },
    comment: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

commentSchema.plugin(normalize)

const Comment = mongoose.model('Comments', commentSchema)

export default Comment
