import bcrypt from 'bcryptjs'
// const users = [
//   {
//     username: 'Ku Ling',
//     email: 'kuling@gmail.com',
//     password: bcrypt.hashSync('123456', 10),
//     role: 'admin',
//   },
//   {
//     username: 'Ku Ma',
//     email: 'kuma@gmail.com',
//     password: bcrypt.hashSync('123456', 10),
//   },
//   {
//     username: 'Chin Long',
//     email: 'chinlong@gmail.com',
//     password: bcrypt.hashSync('123456', 10),
//   },
//   {
//     username: 'Kom Kom',
//     email: 'komkom@gmail.com',
//     password: bcrypt.hashSync('123456', 10),
//   },
// ]

const users = [
  {
    username: 'Admin',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
  },
]

export default users
