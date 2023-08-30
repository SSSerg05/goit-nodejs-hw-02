import express from 'express';
import db from "../../models/contacts.json";
import contacts from '../../models/contacts.js';

const HttpError = (status, message) => { 
  const error = new Error(message);
  error.status = status;
  return error;
}


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
    // res.status(404).json({ message: 'Not found' })
  }
  
})

// додавання запису
router.post('/', async (req, res, next) => {
  try {
    const result = await contacts.addContact(req.body);
    // потрібна перевірка req.body
    res.status(201).json(result);
  } catch (error) {
    
  }
  res.json({ message: 'template message' })
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
