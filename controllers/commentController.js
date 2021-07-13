import asyncHandler from 'express-async-handler'

const getComments = asyncHandler(async (req, res) => {
  const links = res.links
  const data = res.data
  const meta = res.meta
  const response = {
    data: data,
    meta,
    links,
  }
  res.status(200)
  res.send(response)
})

export { getComments }
