import express from 'express';
import Joi from 'joi';

// import contacts from '../models/contacts.js';
// model Mongoose
import Contact from '../models/Contact.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';


// схема для валідації
const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" must be exist`,
    "string.base": `"name" must be text`,
  }),
  email: Joi.string().required(), 
  phone: Joi.string().required()
})

// список всіх контактів
const listContacts = async (req, res) => {

  const result = await Contact.find();
//  const result = await Contact.find({},"-email"); // all fields without email
//  const result = await Contact.find({}, 'name phone'); // all fields with name and phone
  if (!result) {
    throw HttpError(500, "Server not found");
  }

  res.json(result);
}


// // пошук по id
const getContactById = async (req, res) => {

  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw new HttpError(404, "Not found");
  }
  
  res.json(result);
}


// // додавання запису
const addContact = async (req, res) => {

  // Joi validateBody
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "missing required name field. " + error.message);
  }

  const result = await Contact.create(req.body);
  if (!result) {
    throw HttpError(404, "Cannot add Contact");
  }
  
  res.status(201).json(result);
}


// // видалення запису
const removeContact = async (req, res) => {

//   const { id } = req.params;
//   const result = await contacts.removeContact(id);
  
//   if (!result) {
//     throw HttpError(404, `Not found id:${id}`);
//   }
  
//   res.status(200).json({ ...result, message: "Contact deleted" });
}


// // оновлення запису
const updateContact = async (req, res) => {

//   // Joi validateBody
//   const { error } = addSchema.validate(req.body);
//   if (error) { 
//     throw HttpError(400, "Missing fields " + error.message);
//   }

//   const { id } = req.params;
//   const result = await contacts.updateContact(id, req.body);
//   if (!result) {
//     throw HttpError(404, `Not found contact with id:${id}`);
//   }

//   res.json(result);
}

export default {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
}
