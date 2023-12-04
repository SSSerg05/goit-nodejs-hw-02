import express from 'express';

import ctrl from "../../controllers/ctrl-contacts.js";

import { validateBody } from '../../decorators/index.js'; 
import { isValidId, isEmptyBody, authenticate } from '../../middlewares/index.js';
import { contactAddSchema, contactFavoriteSchema, contactUpdateSchema } from '../../models/Contact.js';

const contactsRouter = express.Router();

// if all routes - private
// else need add authenticate for all private-routes in first place
contactsRouter.use(authenticate)

// список всіх контактів
contactsRouter.get('/', ctrl.listContacts);

// пошук по id
contactsRouter.get('/:id', isValidId, ctrl.getContactById);

// додавання запису
contactsRouter.post('/', isEmptyBody, validateBody(contactAddSchema), ctrl.addContact);

// видалення запису
contactsRouter.delete('/:id', isValidId, ctrl.removeContact);

// оновлення запису
contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactUpdateSchema), ctrl.updateContact);

// Оновлення одного поля
contactsRouter.patch('/:id/favorite', isValidId, isEmptyBody, validateBody(contactFavoriteSchema), ctrl.updateContact);

export default contactsRouter
