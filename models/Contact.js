import { Schema, model } from "mongoose"
import Joi from 'joi';

import { handleSaveError, preUpdate } from "./hooks.js";

const mailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const contactShema = new Schema({
  name: {
      type: String,
      required: [true, "name must be exist"],
  },
  email: {
      type: String,
      required: true,
  },
  favorite: {
      type: Boolean,
      default: false,
  },
  phone: {
      type: String,
      required: true,
  },

}, {versionKey: false, timestamps: true});



// hooks mongoose
contactShema.post("save", handleSaveError);

contactShema.pre("findOneAndUpdate", preUpdate);
contactShema.post("findOneAndUpdate", handleSaveError);


// схеми для Joi-валідації 
export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
      "any.required": `"name" must be exist`,
      "string.base": `"name" must be text`,
  }),
  email: Joi.string().pattern(mailRegExp).required(),
  favorite: Joi.boolean(),
  phone: Joi.string().required(),
})


export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(mailRegExp), 
  phone: Joi.string(),
  favorite: Joi.boolean(),
})

export const contactFavoriteSchema = Joi.object({
  favorite: Joi.boolean(),
})


const Contact = model('contact', contactShema);

export default Contact;