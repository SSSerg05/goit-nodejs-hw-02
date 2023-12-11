// model Mongoose
import Contact from '../models/Contact.js';

import HttpError from '../helpers/HttpError.js';
import { ctrlWrapper } from '../decorators/index.js';


// список всіх контактів
const listContacts = async (req, res) => {
  
  // отримати всі дані авторизованого користувача
  const {_id: owner, username} = req.user;

  //пагінація
  const {page=1, limit=10, ...filterParams} = req.query; 
  // console.log(page, limit, favorite);

  const skip = (page - 1) * limit;

  // filter
  const filter = {owner, ...filterParams};
    
  const result = await Contact.find(
    filter,
   "-createdAt -updatedAt",
    {skip, limit, ...filterParams}
  ).populate("owner","username email");

//  const result = await Contact.find({},"-email"); // all fields without email
//  const result = await Contact.find({}, 'name phone'); // all fields with name and phone
  // if (!result.length) {
  //   throw HttpError(400, `DataBase for user ${username} - Empty`); 
  // }

  if (!result) {
    throw HttpError(500, "Server not found"); // DataBase Empty
  }

  res.json(result);
}

// пошук по id
const getContactById = async (req, res) => {

  const { id } = req.params;
  const result = await Contact.findById(id);
  
  if (!result) {
    throw HttpError(404, `Contact with id=${id} - Not found`);
  }
  
  res.json(result);
}


// додавання запису
const addContact = async (req, res) => {

  const {_id: owner} = req.user;
  const result = await Contact.create({...req.body, owner});
  // console.log(result, req.body);

  res.status(201).json(result);
}


// видалення запису
const removeContact = async (req, res) => {
  const { id } = req.params;
  const {_id:owner} = req.user;
  const result = await Contact.findOneAndDelete({_id: id, owner});
  
  if (!result) {
    throw HttpError(404, `Not found id:${id}`);
  }
  
  res.status(200).json({ ...result._doc, message: "Contact deleted" });
}


// оновлення запису
const updateContact = async (req, res) => {

  const { id } = req.params;
  const {_id:owner} = req.user;

  //якщо не створювати hook preUpdate
  //const result = await Contact.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
  const result = await Contact.findOneAndUpdate({_id: id, owner}, req.body);

  if (!result) {
    throw HttpError(404, `Not found contact with id:${id}`);
  }

  res.json(result);
}


// const updateFavorite = async (req, res) => {
//   const { id } = req.params;
//   const result = await Contact.findByIdAndUpdate(id, req.body);
  
//   if (!result) {
//     throw HttpError(400, "missing field favorite");
//   }

//   res.json(result);
// }


export default {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  // updateFavorite: ctrlWrapper(updateFavorite),
}
