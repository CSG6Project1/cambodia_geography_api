import asyncHandler from 'express-async-handler'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'
import ejs from 'ejs'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

const sendVerification = asyncHandler(async (req, res) => {
  const userId = req.id

  const locale = req.body.locale
  const user = await User.findOne({ _id: userId })

  const emailToken = jwt.sign({ id: userId }, process.env.JWT_EMAIL_SECRET, {
    expiresIn: '30s',
  })

  const url = `${process.env.HOST}/api/confirmation/${emailToken}`
  const subjectStr =
    locale === 'km'
      ? 'សូមបញ្ជាក់គណនីអ៊ីមែលរបស់អ្នក'
      : 'Please confirm your Email account'

  const htmlStr = await ejs.renderFile(
    './templates/email_confirmation.ejs',
    {
      head_name: 'Cambodia Geography',
      action_url: 'cambodia-geography.com',
      title: 'Verify your email address',
      subtitle:
        "Thanks for signing up for Cambodia Geography! We're excited to have you as an early user.",
      verify_button_label: 'Verify Email',
      thanks: 'Thanks, ',
      send_by: 'The Cambodia Geography Team',
      issue_message:
        'If you’re having trouble clicking the button, copy and paste the URL below into your web browser.',
      action_url: url,
      office: 'Cambodia Academy of Digital Technology (CADT)',
      office_location:
        'National Road 6A, Kthor, Prek Leap ChroyChangvar, Phnom Penh',
    },
    {}
  )

  const info = await transporter.sendMail({
    from: 'Cambodia Geography <cambodia-geography@gmail.com>',
    to: user.email,
    subject: subjectStr,
    html: htmlStr,
  })
  return res.status(200).send({
    message: 'Message sent',
    expires_in: '30',
  })
})

const verifyVerification = asyncHandler(async (req, res) => {
  const token = req.params.token
  let userId
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_EMAIL_SECRET)
    userId = decodedToken.id
  } catch (error) {
    return res.status(403).send('Verification expired')
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { is_verify: true }
    )
    user.save()
    return res.send('Verify Successfully')
  } catch (error) {
    return res.status(403).send({
      message: 'User not Found',
    })
  }
})

export { sendVerification, verifyVerification }
