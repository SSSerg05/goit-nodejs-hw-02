// model Mongoose
import Contact from '../models/Contact.js';

import HttpError from '../helpers/HttpError.js';
import { ctrlWrapper } from '../decorators/index.js';


// список всіх контактів
const listContacts = async (req, res) => {

  const result = await Contact.find();
//  const result = await Contact.find({},"-email"); // all fields without email
//  const result = await Contact.find({}, 'name phone'); // all fields with name and phone
  if (!result) {
    throw HttpError(500, "Server not found");
  }

  res.json(result);
}


// пошук по id
const getContactById = async (req, res) => {

  const { id } = req.params;
  const result = await Contact.findById(id);
  // console.log(result);
  if (!result) {
    throw new HttpError(404, `Contact with id=${id} - Not found`);
  }
  
  res.json(result);
}


// додавання запису
const addContact = async (req, res) => {

  const result = await Contact.create(req.body);
  // if (!result) {
  //   throw HttpError(404, "Cannot add Contact");
  // }
  
  res.status(201).json(result);
}


// видалення запису
const removeContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  
  if (!result) {
    throw HttpError(404, `Not found id:${id}`);
  }
  
  res.status(200).json({ ...result._doc, message: "Contact deleted" });
//  res.json({
//    message: "Delete success"
//  })
}


// оновлення запису
const updateContact = async (req, res) => {

  const { id } = req.params;

  //якщо не створювати функцію перевірки
  //const result = await Contact.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
  const result = await Contact.findByIdAndUpdate(id, req.body);
  
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
