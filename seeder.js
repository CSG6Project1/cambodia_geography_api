import connectDB from './config/db.js'
import Place from './models/placeModels.js'
import places from './data/place.js'
import users from './data/user.js'
import Comment from './models/commentModels.js'
import User from './models/userModels.js'

connectDB()
const importData = async () => {
  try {
    await Place.deleteMany()
    await Comment.deleteMany()
    await User.deleteMany()

    //create users
    const createdUser = await User.insertMany(users)
    const createdPlaces = await Place.insertMany(await places)
    console.log('Data imported')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Place.deleteMany()
    await Comment.deleteMany()
    await User.deleteMany()

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
