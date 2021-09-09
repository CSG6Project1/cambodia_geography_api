import asyncHandler from 'express-async-handler'
import Bookmark from '../models/bookmarkModels.js'

import multer from 'multer'
import { storage, fileFilter } from '../config/multer.js'
import fuzzysearch from 'fuzzy-search'

const getBookmarkDetail = asyncHandler(async (req, res) => {
  const uid = req.id
  if (!uid) {
    res.send({
      message: 'User Id not found',
    })
    return
  }
  console.log(uid)
  try {
    const bookmarks = await Bookmark.find()
    //console.log(bookmarks)
    const searcher = new fuzzysearch(bookmarks, 'user', {
      caseSensitive: true,
    })
    const bookmark = searcher.search(uid)
    
    if (bookmark) {
      res.send({ bookmark })
    } else {
      res.send({ message: 'Bookmark not found' })
    }
  } catch (error) {
    res.send({
      message: 'Bookmark not found Invalid user Id',
    })
    return
  }
})

const deleteplaceinBookmark = asyncHandler(async (req, res) => {
  const placeId = req.body.placeId //place to delete
  const uid = req.id
  //find bookmark id
  const bookmarks = await Bookmark.find()
  const searcher = new fuzzysearch(bookmarks, 'user', {
    caseSensitive: true,
  })
  const bookmark = searcher.search(uid)
  const bookmarkId = bookmark[0].id

  try {
    const bookmarktoupdate = await Bookmark.findByIdAndUpdate(bookmarkId)
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

const addplacetoBookmark = asyncHandler(async (req, res) => {

  const placeId = req.body.placeId
  const uid = req.id
  const bookmarks = await Bookmark.find()
  const searcher = new fuzzysearch(bookmarks, 'user', {
    caseSensitive: true,
  })
  const bookmark = searcher.search(uid)

  if(bookmark.length != 0){
    const bookmarkId = bookmark[0].id
    // console.log(bookmarkId)
    // console.log(placeId)
    if (!placeId) {
      res.send({
        message: 'Place Id not found',
      })
    } 
    try {
      //const createdComment = await Comment.create({ user: userId, comment })
      if (bookmarkId) {
        const bookmarktoupdate = await Bookmark.findByIdAndUpdate(bookmarkId)
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
  else{
    try {
      const createBookmark = await Bookmark.create({ user: uid })
    } catch (error) {
      res.send({
        message: 'Bookmark cant create',
      })
    }
    const bookmarks2 = await Bookmark.find()
    const searcher = new fuzzysearch(bookmarks2, 'user', {
      caseSensitive: true,
    })
    const bookmark2 = searcher.search(uid)
    const bookmark2Id = bookmark2[0].id

    try{
      if (bookmark2Id) {
        const bookmarktoupdate = await Bookmark.findByIdAndUpdate(bookmark2Id)
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
    }catch(error){
      res.send({
        message: 'Bookmark cant create'
      })
    }
  }
})

export { getBookmarkDetail, deleteplaceinBookmark, addplacetoBookmark }
