import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cookieParser from 'cookie-parser';
import { connectDB } from './libs/db.js'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import { protectedRoute } from './middlewares/authMiddleware.js';

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Routes api
app.use('/api/auth', authRoute)
app.use(protectedRoute);
app.use('/api/users', userRoute)

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on ${port}`)
    console.log(`http://localhost:${port}`)
   
  })
})
