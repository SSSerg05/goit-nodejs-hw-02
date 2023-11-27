import express from 'express';

import ctrl from "../../controllers/ctrl-contacts.js";

import {validateBody} from '../../decorators/validateBody.js'; 
import { isValidId, isEmptyBody } from '../../middlewares/index.js';
import { contactAddSchema, contactUpdateSchema } from '../../models/Contact.js';

const contactsRouter = express.Router();

// список всіх контактів
contactsRouter.get('/', ctrl.listContacts);

// пошук по id
contactsRouter.get('/:id', isValidId, ctrl.getContactById);

// додавання запису
// isEmptyBody, validateBody(contactAddSchema),
contactsRouter.post('/', ctrl.addContact);

// видалення запису
contactsRouter.delete('/:id', ctrl.removeContact);

// оновлення запису
contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactUpdateSchema), ctrl.updateContact);

// Оновлення одного поля
// contactsRouter.patch('/:id', isValidId, isEmptyBody, validateBody, ctrl.updateContact);

export default contactsRouter
