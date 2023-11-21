import app from './app.js'
import mongoose from 'mongoose'

const DB_HOST = "mongodb+srv://SSerg:lUXIBymHzzGQJUWG@cluster0.w5v2ol5.mongodb.net/db-contacts?retryWrites=true&w=majority"

mongoose.connect(DB_HOST)
  .then( () => {
    console.log("Success connect to database");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000")
    });
  })
  .catch(error => {
    console.log(error.message)
    process.exit(1);
  })

