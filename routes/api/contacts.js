import express from 'express';
import Joi from 'joi';

import contacts from '../../models/contacts.js';

const HttpError = (status, message) => { 
  const error = new Error(message);
  error.status = status;
  return error;
}


const addSchema = Joi.object({
  name: Joi.string().required,
  email: Joi.string().required, 
  phone: Joi.string().required,
})

const router = express.Router()

// список всіх контактів
router.get('/', async (req, res, next) => {
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
})

// пошук по id
router.get('/:contactId', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getContactById(id);
    
    if (!result) {
      throw HttpError(404, "Not found");
    }
    
    res.json(result);

  } catch (error) {
    next(error);
  }
})

// додавання запису
router.post('/', async (req, res, next) => {
  try {
   
    // потрібна перевірка req.body
    const { error } = addSchema.validate(req.body);
    if (error) { 
      throw HttpError(400, error.message);
    }

    const result = await contacts.addContact(req.body);
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
})

// видалення запису
router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

// 
router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

export default router
