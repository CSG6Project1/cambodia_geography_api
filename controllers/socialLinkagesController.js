import asyncHandler from 'express-async-handler'
import admin from 'firebase-admin'
import User from '../models/userModels.js'

const addSocialLinkages = asyncHandler(async (req, res) => {
  const userId = req.id

  const id_token = req.body.id_token
  if (id_token) {
    admin
      .auth()
      .verifyIdToken(id_token)
      .then(async (decodedToken) => {
        const uId = decodedToken.uid
        const provider = decodedToken.firebase.sign_in_provider
        const user = await User.findOne({ credential_id: uId })
        if (user) {
          return res.status(403).send({
            message: 'This account has already linked',
          })
        } else {
          const user = await User.findByIdAndUpdate(userId)
          user.credential_id.push(uId)
          user.providers.push(provider)
          user.save()
          return res.status(200).send({
            message: 'Linked Successful',
          })
        }
      })
      .catch((error) => {
        return res.status(403).send({
          message: error.message,
        })
      })
  } else {
    return res.status(403).send({
      message: 'Id Token not found',
    })
  }
})

const deleteSocialLinkages = asyncHandler(async (req, res) => {
  const userId = req.id
  const provider = req.params.provider

  const user = await User.findOne({ _id: userId })
  const index = user.providers.findIndex((e) => {
    return e === provider
  })

  if (!user.email && user.providers.length === 1) {
    return res.status(403).send({
      message: 'Disconnect failed',
    })
  }

  if (index === -1) {
    return res.status(403).send({
      message: 'Provider Not Found',
    })
  }

  const string = `credential_id.${index}`
  try {
    const user = await User.findOneAndUpdate(userId, {
      $unset: { [string]: 1 },
    })
    await user.credential_id.pull(null)
    await user.providers.pull(provider)
    user.save()
    const responseProvider = provider.split('.com')[0]
    return res.status(200).send({
      message: `${responseProvider.toUpperCase()} Disconnected Successfully`,
    })
  } catch (error) {
    return res.status(403).send({
      message: 'Disconnect failed',
    })
  }
})

export { addSocialLinkages, deleteSocialLinkages }
