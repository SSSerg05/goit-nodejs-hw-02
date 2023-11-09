import express from 'express';

import ctrlMovie from "../../controllers/ctrl-movies.js";

const contactsRouter = express.Router();

// список всіх контактів
moviesRouter.get('/', ctrlMovie.listContacts);

// пошук по id
moviesRouter.get('/:id', ctrlMovie.getContactById);

// додавання запису
moviesRouter.post('/', ctrlMovie.addContact);

// видалення запису
moviesRouter.delete('/:id', ctrlMovie.removeContact);

// оновлення запису
moviesRouter.put('/:id', ctrlMovie.updateContact);

export default moviesRouter
