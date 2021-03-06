import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import bcrypt from 'bcryptjs'

const imageSchema = mongoose.Schema(
  {
    id: String,
    type: String,
    url: String,
  },
  { _id: false }
)

const userSchema = mongoose.Schema(
  {
    username: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    credential_id: [{ type: String }],
    profile_img: imageSchema,
    is_verify: { type: Boolean, default: false },
    providers: [{ type: String }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

userSchema.plugin(normalize)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('Users', userSchema)

export default User
