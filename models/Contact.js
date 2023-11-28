import { Schema, model } from "mongoose"
import Joi from 'joi';

import { handleSaveError, preUpdate } from "./hooks.js";


const contactShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // unique: true,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
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
  email: Joi.string().required().messages({
    "any.required": `"email" must be exist`,
    "string.base": `"email" must be text`,
  }), 
  phone: Joi.string().required().messages({
    "any.required": `"phone" must be exist`,
    "string.base": `"phone" must be text`,
  }),
  favorite: Joi.boolean().required(),
})

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(), 
  phone: Joi.string(),
  favorite: Joi.boolean(),
})

export const contactFavoriteShema = Joi.object({
  favorite: Joi.boolean().required,
})


const Contact = model('contact', contactShema);

export default Contact;