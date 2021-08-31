import asyncHandler from 'express-async-handler'
import fuzzysearch from 'fuzzy-search'

const linkPaginate = (increase, decrease, listQuery, first, last) => {
  let base_URL = `${process.env.HOST}/api/filterplaces/result`
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

const getFilterPlaces = (model) =>
  asyncHandler(async (req, res) => {
    const place = await model.find()
    
    function getplacetofilter(){
      if (req.query['keyword']) {
        const searcher2 = new fuzzysearch(place, ['khmer', 'english'], {
          caseSensitive: true,
        })
        const result2 = searcher2.search(req.query['keyword'])
        //console.log("This is result2 length: "+result2.length)
        return result2
      }
      else{
        return place
      }
    }
    
    const places = getplacetofilter()

    let province_search
    let district_search
    let commune_search
    let village_search
    let final_result = []
    let not_found
    // console.log("__________________________________")
    // console.log("place: " + req.query['type'])
    // console.log("province code: " + req.query['province_code'])
    // console.log("district code: " + req.query['district_code'])
    // console.log("commune code: " + req.query['commune_code'])
    // console.log("village code: " + req.query['village_code'])
    function searching(obj, field, key) {
      const searcher = new fuzzysearch(obj, [field], { caseSensitive: true })
      const result = searcher.search(key)
      return result
    }
    if (req.query['type'] == 'place') {
      let place_search = searching(places, 'type', req.query['type'])
      if (place_search.length != 0) {
        if (
          req.query['province_code'] == 'null' ||
          req.query['province_code'] == null
        ) {
          province_search = place_search
        } else {
          province_search = searching(
            place_search,
            'province_code',
            req.query['province_code']
          )
        }
        if (province_search.length != 0) {
          if (
            req.query['district_code'] == 'null' ||
            req.query['district_code'] == null
          ) {
            district_search = province_search
          } else {
            district_search = searching(
              province_search,
              'district_code',
              req.query['district_code']
            )
          }
          if (district_search.length != 0) {
            if (
              req.query['commune_code'] == 'null' ||
              req.query['commune_code'] == null
            ) {
              commune_search = district_search
            } else {
              commune_search = searching(
                district_search,
                'commune_code',
                req.query['commune_code']
              )
            }
            if (commune_search.length != 0) {
              if (
                req.query['village_code'] == 'null' ||
                req.query['village_code'] == null
              ) {
                village_search = commune_search
              } else {
                village_search = searching(
                  commune_search,
                  'village_code',
                  req.query['village_code']
                )
              }
              if (village_search.length != 0) {
                final_result = village_search
              } else {
                not_found = 'no data not found in this village'
              }
            } else {
              not_found = 'no data not found in this commune'
            }
          } else {
            not_found = 'no data not found in this district'
          }
        } else {
          not_found = 'no data not found in this province'
        }
      } else {
        not_found = 'Data not found'
      }
    } else if (req.query['type'] == 'restaurant') {
      let place_search = searching(places, 'type', req.query['type'])
      if (place_search.length != 0) {
        if (
          req.query['province_code'] == 'null' ||
          req.query['province_code'] == null
        ) {
          province_search = place_search
        } else {
          province_search = searching(
            place_search,
            'province_code',
            req.query['province_code']
          )
        }
        if (province_search.length != 0) {
          if (
            req.query['district_code'] == 'null' ||
            req.query['district_code'] == null
          ) {
            district_search = province_search
          } else {
            district_search = searching(
              province_search,
              'district_code',
              req.query['district_code']
            )
          }
          if (district_search.length != 0) {
            if (
              req.query['commune_code'] == 'null' ||
              req.query['commune_code'] == null
            ) {
              commune_search = district_search
            } else {
              commune_search = searching(
                district_search,
                'commune_code',
                req.query['commune_code']
              )
            }
            if (commune_search.length != 0) {
              if (
                req.query['village_code'] == 'null' ||
                req.query['village_code'] == null
              ) {
                village_search = commune_search
              } else {
                village_search = searching(
                  commune_search,
                  'village_code',
                  req.query['village_code']
                )
              }
              if (village_search.length != 0) {
                final_result = village_search
              } else {
                not_found = 'no data not found in this village'
              }
            } else {
              not_found = 'no data not found in this commune'
            }
          } else {
            not_found = 'no data not found in this district'
          }
        } else {
          not_found = 'no data not found in this province'
        }
      } else {
        not_found = 'Data not found'
      }
    } else {
      final_result = places
    }

    if (final_result.length != 0) {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.per_page) || 5
      const listQuery = []

      let modelLength = final_result.length

      if (req.query['type']) {
        listQuery.push({ name: 'type', value: req.query['type'] })
      }
      if (req.query['province_code']) {
        listQuery.push({
          name: 'province_code',
          value: req.query['province_code'],
        })
      }
      if (req.query['district_code']) {
        listQuery.push({
          name: 'district_code',
          value: req.query['district_code'],
        })
      }
      if (req.query['commune_code']) {
        listQuery.push({
          name: 'commune_code',
          value: req.query['commune_code'],
        })
      }
      if (req.query['village_code']) {
        listQuery.push({
          name: 'village_code',
          value: req.query['village_code'],
        })
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

      data = final_result.slice(startIndex, endIndex)

      const response = {
        data: data,
        meta,
        links,
      }
      res.status(200)
      res.send(response)
    } else {
      res.send({ message: not_found })
    }
  })

export { getFilterPlaces }
