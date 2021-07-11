import connectDB from './config/db.js'
import Place from './models/placeModels.js'
import places from './data/place.js'

connectDB()

const importData = async () => {
  try {
    await Place.deleteMany()

    const createdPlaces = await Place.insertMany(places)
    console.log('Data imported')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Place.deleteMany()

    console.log('Data Destroyed')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (process.argv[2] === 'd') {
  destroyData()
} else {
  importData()
}
