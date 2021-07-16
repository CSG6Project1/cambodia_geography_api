import connectDB from './config/db.js'
import Place from './models/placeModels.js'
import places_random from './data/places_random.js'
import restaurant_random from './data/restaurants_random.js'
import users from './data/user.js'
import Comment from './models/commentModels.js'
import comments from './data/comment.js'
import User from './models/userModels.js'

connectDB()

const importData = async () => {
  try {
    await Place.deleteMany()
    await Comment.deleteMany()
    await User.deleteMany()

    //create users
    const createdUser = await User.insertMany(users)
    const adminUser = createdUser[0]._id

    //create comments
    const sampleComment = comments.map((comment) => {
      return { ...comment, user: adminUser }
    })
    const createdComment = await Comment.insertMany(sampleComment)
    const commentId = createdComment.map((comment) => {
      return comment.id
    })

    //create places
    const randomPlace = places_random.map((place) => {
      return { ...place, comments: commentId }
    })
    const randomRestuarant = restaurant_random.map((restaurant) => {
      return { ...restaurant, comments: commentId }
    })

    const createdPlaces = await Place.insertMany(randomPlace)
    const createdRestaurant = await Place.insertMany(randomRestuarant)
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
