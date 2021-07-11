import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import placeRoutes from './routes/placeRoutes.js'

dotenv.config()
connectDB()
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running....')
})

app.use('/places', placeRoutes)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on PORT ${PORT} `)
})
