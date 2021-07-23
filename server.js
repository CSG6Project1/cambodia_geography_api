import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import placeRoutes from './routes/placeRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authMiddleware from './middlewares/authMiddleware.js'
import { userDetail } from './controllers/userController.js'

dotenv.config()
connectDB()
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running....')
})
app.get('/account', authMiddleware, userDetail)
app.use('/places', placeRoutes)
app.use('/comment', commentRoutes)
app.use('/user', userRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on PORT ${PORT} `)
})
