import asyncHandler from 'express-async-handler'
import fuzzysearch from 'fuzzy-search'

const linkPaginate = (increase, decrease, listQuery, first, last) => {
    let base_URL = `${process.env.HOST}/searchplaces/result`
    let sign = '?'
    listQuery.forEach((q, index) => {
      if (index !== 0) sign = '&'
      if (increase && q.name === 'page') {
        base_URL += `${sign}${q.name}=${q.value + 1}`
      } else if (first && q.name === 'page') {
        base_URL += `${sign}${q.name}=1`
      } else if (last && q.name === 'page') {
        base_URL += `${sign}${q.name}=${last}`
      } else if (decrease && q.name === 'page') {
        base_URL += `${sign}${q.name}=${q.value - 1}`
      } else {
        base_URL += `${sign}${q.name}=${q.value}`
      }
    })
    return base_URL
  }
  
  const getPlaces = (model) =>
    asyncHandler(async (req, res) => {
      let result = []
      if(!req.query['keyword']){
            res.send({
                message: "Please input keyword[keyword]"})
      }
      await model.find((err,docs)=>{
        if(!err){
            //searching
            console.log("Hello")
            const searcher = new fuzzysearch(docs,['khmer','english'],{caseSensitive: true})
            result = searcher.search(req.query['keyword'])
            
        }
        else{ 
            res.send({message:"Error connection to model"})
        }
      }).exec()
      
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.per_page) || 5
      const listQuery = []
     
      let modelLength = result.length
      
      if (req.query['keyword']) {
        listQuery.push({ name: 'keyword', value: req.query['keyword'] })
      }

      listQuery.push({ name: 'page', value: page })
      
      if (req.query.per_page) {
        listQuery.push({ name: 'per_page', value: limit })
      }
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      let links = {}
      let data = []
      let meta = {}
  
      meta.count = limit
      meta.total_count = modelLength
      meta.total_pages = Math.ceil(modelLength / limit)
  
      if (endIndex === modelLength) {
        links.self = linkPaginate(false, false, listQuery, false, false)
        links.first = linkPaginate(false, false, listQuery, true, false)
        links.last = linkPaginate(
          false,
          false,
          listQuery,
          false,
          Math.ceil(modelLength / limit)
        )
      }
  
      if (endIndex < modelLength) {
        links.self = linkPaginate(false, false, listQuery, false, false)
        if (page + 1 <= Math.ceil(modelLength / limit)) {
          links.next = linkPaginate(true, false, listQuery, false, false)
        }
  
        if (page - 1 > 0) {
          links.prev = linkPaginate(false, true, listQuery, false, false)
        }
  
        links.first = linkPaginate(false, false, listQuery, true, false)
        links.last = linkPaginate(
          false,
          false,
          listQuery,
          false,
          Math.ceil(modelLength / limit)
        )
      } else if (endIndex > modelLength) {
        links.self = linkPaginate(false, false, listQuery, false, false)
        links.first = linkPaginate(false, false, listQuery, true, false)
        links.last = linkPaginate(
          false,
          false,
          listQuery,
          false,
          Math.ceil(modelLength / limit)
        )
      }
  
      if (startIndex > 0) {
        links.self = linkPaginate(false, false, listQuery, false, false)
        if (page + 1 < Math.ceil(modelLength / limit)) {
          links.next = linkPaginate(true, false, listQuery, false, false)
        }
  
        if (page - 1 > 0) {
          links.prev = linkPaginate(false, true, listQuery, false, false)
        }
        links.first = linkPaginate(false, false, listQuery, true, false)
        links.last = linkPaginate(
          false,
          false,
          listQuery,
          false,
          Math.ceil(modelLength / limit)
        )
      }
  
      try { 
        data = result.slice(startIndex,endIndex)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  
      const response = {
        data: data,
        meta,
        links,
      }
      res.status(200)
      res.send(response)
    })


    export { getPlaces }