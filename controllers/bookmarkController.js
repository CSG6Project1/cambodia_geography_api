import asyncHandler from 'express-async-handler'
import Bookmark from '../models/bookmarkModels.js'

const getBookmarkDetail = asyncHandler(async (req, res) => {
  const type = req.query['type']
  const uid = req.id
  let count = 3
  let skip = 3

  let result = { "data": {}, "meta": {}, "links": {} }
  let tmp_result

  if (!uid) {
    res.send({
      message: 'User Id not found',
    })
    return
  }

  try {
    let findlength
    if (type) {
      findlength = await Bookmark.findOne({ user: uid }).populate({
        path: 'places',
        match: {
          type: type.toString()
        }
      })
    } else {
      findlength = await Bookmark.findOne({ user: uid }).populate({
        path: 'places'
      })
    }

    let total_pages = Math.round(findlength.places.length / count)
    let total_count = findlength.places.length
    if(total_pages ==0){
      total_pages=1
    }
    if(total_count <= count){
      count=total_count,
      skip=0
    }

    //links
    let base_URL
    if (type) {
      base_URL = `${process.env.HOST}/api/bookmark?type=${type.toString()}&`
    } else {
      base_URL = `${process.env.HOST}/api/bookmark?`
    }

    let page = parseInt(req.query['page'])
    if (!page) {
      page = 1
    }
    let nextpage = page + 1
    let prevpage = page - 1
    let startindex = skip * (page - 1)
    let show = startindex + count
    let self
    let next
    let prev
    let first = base_URL + `page=1`
    let last = base_URL + `page=${total_pages}`

    if (type) {
      if(page == 1 && total_pages == 1){
        tmp_result = await Bookmark.findOne({ user: uid }).populate({
          path: 'places',
          match: {
            type: type.toString()
          },
          options: { skip: startindex, limit: count }
        })
        self = base_URL + `page=${page}`
      }
      else if (page == 1) {
        tmp_result = await Bookmark.findOne({ user: uid }).populate({
          path: 'places',
          match: {
            type: type.toString()
          },
          options: { skip: startindex, limit: count },
        })
        self = base_URL + `page=${page}`
        next = base_URL + `page=${nextpage}`
      }
      else if (page == total_pages) {
        if (total_count - show < count) {
          count = count + total_count - show
        }
        tmp_result = await Bookmark.findOne({ user: uid }).populate({
          path: 'places',
          match: {
            type: type.toString()
          },
          options: { skip: startindex, limit: count }
        })
        self = base_URL + `page=${page}`
        prev = base_URL + `page=${prevpage}`
      }
      else {
        tmp_result = await Bookmark.findOne({ user: uid }).populate({
          path: 'places',
          match: {
            type: type.toString()
          },
          options: { skip: startindex, limit: count },
        })
        self = base_URL + `page=${page}`
        next = base_URL + `page=${nextpage}`
        prev = base_URL + `page=${prevpage}`
      }
    } else {
      if(page == 1 && total_pages == 1){
        tmp_result = await Bookmark.findOne({ user: uid }).populate({
          path: 'places',
          options: { skip: startindex, limit: count }
        })
        self = base_URL + `page=${page}`
      }
      else if (page == 1) {
        tmp_result = await Bookmark.findOne({ user: uid }).populate({
          path: 'places',
          options: { skip: startindex, limit: count },
        })
        self = base_URL + `page=${page}`
        next = base_URL + `page=${nextpage}`
      }
      else if (page == total_pages) {
        if (total_count - show < count) {
          count = count + total_count - show
        }
        tmp_result = await Bookmark.findOne({ user: uid }).populate({
          path: 'places',
          options: { skip: startindex, limit: count }
        })
        self = base_URL + `page=${page}`
        prev = base_URL + `page=${prevpage}`
      }
      else {
        tmp_result = await Bookmark.findOne({ user: uid }).populate({
          path: 'places',
          options: { skip: startindex, limit: count },
        })
        self = base_URL + `page=${page}`
        next = base_URL + `page=${nextpage}`
        prev = base_URL + `page=${prevpage}`
      }
    }

    let places = tmp_result.places
    let data = []
    let tmp_obj = {
      bookmark: {}
    }
    
    for (let i = 0; i < count; i++) {
      tmp_obj.comments = places[i].comments
      tmp_obj._id = places[i]._id
      tmp_obj.english = places[i].english
      tmp_obj.khmer = places[i].khmer
      tmp_obj.type = places[i].type
      tmp_obj.province_code = places[i].province_code
      tmp_obj.district_code = places[i].district_code
      tmp_obj.commune_code = places[i].commune_code
      tmp_obj.village_code = places[i].village_code
      tmp_obj.lat = places[i].lat
      tmp_obj.lon = places[i].lon
      tmp_obj.body = places[i].body
      tmp_obj.images = places[i].images
      tmp_obj.created_at = places[i].created_at
      tmp_obj.updated_at = places[i].updated_at
      tmp_obj.id = places[i].id
      tmp_obj.__v = places[i].__v

      tmp_obj.bookmark._id = tmp_result._id
      tmp_obj.bookmark.user = tmp_result.user
      tmp_obj.bookmark.created_at = tmp_result.created_at
      tmp_obj.bookmark.updated_at = tmp_result.updated_at
      tmp_obj.bookmark.id = tmp_result.id
      tmp_obj.bookmark.__v = tmp_result.__v


      data[i] = tmp_obj
      tmp_obj = { "bookmark": {} }

    }
    result.data = data

    result.links.self = self
    if (next != null) result.links.next = next
    if (prev != null) result.links.prev = prev
    result.links.first = first
    result.links.last = last

    //meta
    result.meta.count = count
    result.meta.total_count = findlength.places.length
    result.meta.total_pages = total_pages

    //return result
    if (result) {
      res.json(result)
    } else {
      res.send({ message: 'Bookmark not found' })
    }
  } catch (error) {
    res.send({
      message: 'Error getting',
    })
    return
  }
})

const deleteaplaceinBookmark = asyncHandler(async (req, res) => {
  const placeId = req.params.placeId //place to delete
  const uid = req.id

  try {
    const bookmarktoupdate = await Bookmark.findOneAndUpdate({ user: uid })
    bookmarktoupdate.places.pull(placeId)
    bookmarktoupdate.save()
    res.send({
      message: 'Bookmark deleted',
    })
  }
  catch (error) {
    res.send({
      message: 'Bookmark not deleted',
    })
  }
})

const emptyplaceinBookmark = asyncHandler(async (req, res) => {
  //const placeId = req.body.placeId //place to delete
  const uid = req.id

  try {
    const bookmarktoupdate = await Bookmark.findOne({ user: uid })
    bookmarktoupdate.set("places",[])
    bookmarktoupdate.save()
    res.send({
      message: 'Bookmark deleted',
    })
  }
  catch (error) {
    res.send({
      message: 'Bookmark not remove all',
    })
  }
})
const deletemultipleplaceinBookmark = asyncHandler(async (req, res) => {
  const placeId = req.body.placeId //place to delete
  const uid = req.id

  try {
    const bookmarktoupdate = await Bookmark.findOneAndUpdate({ user: uid })
    for (let i = 0; i < placeId.length; i++) {
      bookmarktoupdate.places.pull(placeId[i])
    }
    bookmarktoupdate.save()
    res.send({
      message: 'Bookmark deleted',
    })
  }
  catch (error) {
    res.send({
      message: 'Bookmark not deleted',
    })
  }

})
const addplacetoBookmark = asyncHandler(async (req, res) => {

  const placeId = req.body.placeId
  const uid = req.id
  const bookmarks = await Bookmark.findOne({ user: uid })

  if (bookmarks) {
    if (!placeId) {
      res.send({
        message: 'Place Id not found',
      })
    }
    try {
      if (bookmarks) {
        const bookmarktoupdate = await Bookmark.findOneAndUpdate({ user: uid })
        bookmarktoupdate.places.push(placeId)
        bookmarktoupdate.save()
        res.send({
          message: 'bookmark added',
        })
      } else {
        res.send({
          message: 'Cant add bookmark',
        })
      }
    } catch (error) {
      res.send({
        message: 'Bookmark not found',
      })
    }
  }
  else {
    try {
      const createBookmark = await Bookmark.create({ user: uid })
    } catch (error) {
      res.send({
        message: 'Bookmark cant create',
      })
    }
    try {
      if (uid) {
        const bookmarktoupdate = await Bookmark.findOneAndUpdate(uid)
        bookmarktoupdate.places.push(placeId)
        bookmarktoupdate.save()
        res.send({
          message: 'bookmark added',
        })
      } else {
        res.send({
          message: 'Cant add bookmark',
        })
      }
    } catch (error) {
      res.send({
        message: 'Bookmark cant create'
      })
    }
  }
})

export { getBookmarkDetail, deleteaplaceinBookmark, addplacetoBookmark, emptyplaceinBookmark, deletemultipleplaceinBookmark }
