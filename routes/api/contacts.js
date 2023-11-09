import express from 'express';

import ctrl from "../../controllers/ctrl-contacts.js";

const contactsRouter = express.Router();

// список всіх контактів
contactsRouter.get('/', ctrl.listContacts);

// пошук по id
contactsRouter.get('/:id', ctrl.getContactById);

// додавання запису
contactsRouter.post('/', ctrl.addContact);

// видалення запису
contactsRouter.delete('/:id', ctrl.removeContact);

// оновлення запису
contactsRouter.put('/:id', ctrl.updateContact);

export default contactsRouter
