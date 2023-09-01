import express from 'express';

import ctrl from "../../controllers/ctrl-contacts.js";

const router = express.Router();

// список всіх контактів
router.get('/', ctrl.listContacts);

// пошук по id
router.get('/:id', ctrl.getContactById);

// додавання запису
router.post('/', ctrl.addContact);

// видалення запису
router.delete('/:id', ctrl.removeContact);

// оновлення запису
router.put('/:id', ctrl.updateContact);

export default router
