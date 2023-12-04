import express from 'express';
import Joi from 'joi';

import contacts from '../models/contacts.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';


// схема для валідації
const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(), 
  phone: Joi.string().required()
})

// список всіх контактів
const listContacts = async (req, res) => {

  const result = await contacts.listContacts();
  if (!result) {
    throw HttpError(500, "Server not found");
  }

  res.json(result);
}


// пошук по id
const getContactById = async (req, res) => {

  const { id } = req.params;
  const result = await contacts.getContactById(id);
  if (!result) {
    throw new HttpError(404, "Not found");
  }
  
  res.json(result);
}


// додавання запису
const addContact = async (req, res) => {

  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "missing required name field. " + error.message);
  }

  const result = await contacts.addContact(req.body);
  if (!result) {
    throw HttpError(404, "Cannot add Contact");
  }
  
  res.status(201).json(result);
}


// видалення запису
const removeContact = async (req, res) => {

  const { id } = req.params;
  const result = await contacts.removeContact(id);
  
  if (!result) {
    throw HttpError(404, `Not found id:${id}`);
  }
  
  res.status(200).json({ ...result, message: "Contact deleted" });
}


// оновлення запису
const updateContact = async (req, res) => {

  const { error } = addSchema.validate(req.body);
  if (error) { 
    throw HttpError(400, "Missing fields " + error.message);
  }

  const { id } = req.params;
  const result = await contacts.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, `Not found contact with id:${id}`);
  }

  res.json(result);
}

export default {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
}
