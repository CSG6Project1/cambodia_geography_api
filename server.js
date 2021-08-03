import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import placeRoutes from './routes/placeRoutes.js'
import searchplaceRoutes from './routes/searchplaceRoutes.js'
import filterplaceRoutes from './routes/filterplaceRoutes.js'
import autocompleterRoutes from './routes/autocompleterRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authMiddleware from './middlewares/authMiddleware.js'
import { userDetail } from './controllers/userController.js'
import cors from 'cors'

dotenv.config()
connectDB()
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('API is running....')
})
app.get('/account', authMiddleware, userDetail)
app.use('/places', placeRoutes)
app.use('/searchplaces', searchplaceRoutes)
app.use('/filterplaces', filterplaceRoutes)
app.use('/autocompleter', autocompleterRoutes)
app.use('/comment', commentRoutes)
app.use('/user', userRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on PORT ${PORT} `)
})
