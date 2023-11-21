import app from './app.js'
import mongoose from 'mongoose'

const DB_HOST = "mongodb+srv://SSerg:lUXIBymHzzGQJUWG@cluster0.w5v2ol5.mongodb.net/"

mongoose.connect(DB_HOST)
  .then( () => console.log("Success connect to database"))
  .catch(error => console.log(error.message))

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})