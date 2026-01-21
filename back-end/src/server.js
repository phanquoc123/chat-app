import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './libs/db.js'
// import { connect } from 'mongoose'
// import { connectDB } from './libs/db'

dotenv.config()
const app = express()
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World')
})
connectDB().then(() => {

    app.listen(3000, () => {
      console.log('Server is running')
    })
})