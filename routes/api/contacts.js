import express from 'express';
import Joi from 'joi';

import contacts from '../../models/contacts.js';

const HttpError = (status, message) => { 
  const error = new Error(message);
  error.status = status;
  return error;
}

// схема для валідації
const addSchema = Joi.object({
  name: Joi.string().required,
  email: Joi.string().required, 
  phone: Joi.string().required,
})

const router = express.Router()


// список всіх контактів
router.get('/', async (req, res, next) => {
  try {
    console.log(req, res);
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
    console.log(req, res);
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
    
    if (!result) {
      throw HttpError(404, "Cannot add Contact");
    }
    
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
})


// видалення запису
router.delete('/:contactId', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    
    if (!result) {
      throw HttpError(404, `Not found id:${id}`);
    }
    
    res.status(201).json(result);
  } catch (error) {
      next(error);
  }

})


// оновлення запису
router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) { 
      throw HttpError(400, "Missing fields " + error.message);
    }

    const { id } = req.params;
    const result = await contacts.updateContact(id, data);

    if (!result) {
      throw HttpError(404, `Not found contact with id:${id}`);
    }

    res.json(result);

  } catch (error) {
    next(error);
  }
})

export default router
