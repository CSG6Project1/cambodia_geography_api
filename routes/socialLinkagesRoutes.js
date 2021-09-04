import express from 'express'
import {
  addSocialLinkages,
  deleteSocialLinkages,
} from '../controllers/socialLinkagesController.js'

const router = express.Router()

router.post('/', addSocialLinkages).delete('/:provider', deleteSocialLinkages)

export default router
