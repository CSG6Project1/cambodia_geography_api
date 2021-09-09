import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import placeRoutes from './routes/placeRoutes.js'
import searchplaceRoutes from './routes/searchplaceRoutes.js'
import filterplaceRoutes from './routes/filterplaceRoutes.js'
import autocompleterRoutes from './routes/autocompleterRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import bookmarkRoutes from './routes/bookmarkRoutes.js'
import socialLinkagesRoutes from './routes/socialLinkagesRoutes.js'
import userRoutes from './routes/userRoutes.js'
import verificationRoutes from './routes/verificationRoutes.js'
import authMiddleware from './middlewares/authMiddleware.js'
import { userDetail } from './controllers/userController.js'
import cors from 'cors'
import admin from 'firebase-admin'

admin.initializeApp({
  projectId: 'cambodia-geography',
})

dotenv.config()
connectDB()
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('API is running....')
})
app.get('/api/account', authMiddleware, userDetail)
app.use('/api/places', placeRoutes)
app.use('/api/searchplaces', searchplaceRoutes)
app.use('/api/filterplaces', filterplaceRoutes)
app.use('/api/autocompleter', autocompleterRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/bookmark',bookmarkRoutes)
app.use('/api/user', userRoutes)
app.use('/api/confirmation', verificationRoutes)
app.use('/api/user_account_linkages', socialLinkagesRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on PORT ${PORT} `)
})
