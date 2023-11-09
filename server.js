import { listen } from './app.js'

listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})