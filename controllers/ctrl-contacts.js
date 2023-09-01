import express from 'express';
import Joi from 'joi';

import contacts from '../../models/contacts.js';
import HttpError from '../../helpers/HttpError.js';


// схема для валідації
const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(), 
  phone: Joi.string().required()
})

// список всіх контактів
const listContacts = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    
    if (!result) {
      throw HttpError(500, "Server not found");
    }

    res.json(result);
  } catch (error) {
      next(error);
      //res.status(500).json({message: "Server not found"})
  }
}


// пошук по id
const getContactById = async (req, res, next) => {
  try {

    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      throw new HttpError(404, "Not found");
    }
    
    res.json(result);

  } catch (error) {
    next(error);
  }
}


// додавання запису
const addContact = async (req, res, next) => {
  try {

    // потрібна перевірка req.body
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Не має даних для додавання. " + error.message);
    }

    const result = await contacts.addContact(req.body);
    
    if (!result) {
      throw HttpError(404, "Cannot add Contact");
    }
    
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
}


// видалення запису
const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    
    if (!result) {
      throw HttpError(404, `Not found id:${id}`);
    }
    
    res.status(200).json({ ...result, message: "Contact deleted" });
  } catch (error) {
      next(error);
  }

}


// оновлення запису
const updateContact = async (req, res, next) => {
  try {
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

  } catch (error) {
    next(error);
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
