import express, { json } from 'express'
import logger from 'morgan'
import cors from 'cors'

import contactsRouter from './routes/api/contacts.js'

const app = express();
app.listen(3000, () => console.log("Server run on 3000 port"));

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(json())

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error"} = err
  res.status(status).json({ message })
})

export default app
