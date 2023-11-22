import { Schema, model } from "mongoose"

const contactShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
})

const Contact = model('contact', contactShema);

export default Contact;