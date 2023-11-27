import { Schema, model } from "mongoose"
import { handleSaveError, preUpdate } from "./hooks.js";


const contactShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, {versionKey: false, timestamps: true});

// hooks mongoose
//contactShema.pre("")
contactShema.post("save", handleSaveError);

contactShema.pre("findOneAndUpdate", preUpdate);
contactShema.post("findOneAndUpdate", handleSaveError);

const Contact = model('contact', contactShema);

export default Contact;