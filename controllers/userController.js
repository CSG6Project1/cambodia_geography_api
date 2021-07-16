import asyncHandler from 'express-async-handler'

const userLogin = asyncHandler(async (req, res) => {
  const response = res.response
  res.status(res.statusCode)
  res.send(response)
})

export default userLogin
