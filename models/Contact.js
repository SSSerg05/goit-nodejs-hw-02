import { Schema, model } from "mongoose"

const contactShema = new Schema({
  name: String,
  email: String,
  phone: String,
})

const Contact = model('contact', contactShema);

export default Contact;