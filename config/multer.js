import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.fieldname)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/jpeg' ||
    file.mimetype == 'image/gif'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
    return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'))
  }
}

export { storage, fileFilter }
