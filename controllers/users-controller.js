import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import HttpError from '../helpers/HttpError.js';
import { ctrlWrapper } from '../decorators/index.js';


const {JWT_SECRET} = process.env;

// Реєстрація користувача
//------------------------
const signUp = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({email});
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const newUser = await User.create({...req.body, password: hashPassword});
  
  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    subscription: newUser.subscription,
  })
}

// авторизований вхід 
//------------------------
const signIn = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    throw HttpError(401, "User not found");
  }
  
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password wrong");
  }

  const payload = {
    id: user.id,
  }

  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
  
  res.json({
    token,
  })
}


// отримання даних про поточного користувача
//------------------------
const getCurrent =  async (req, res) => {
  const {_id, username, email, subscription} = req.user;
  if (!_id) {
    throw HttpError(401, "User not authorized");
  }
  res.status(200).json ({
    username,
    email,
    subscription,
  })
}

// вихід з облікового запису
//------------------------
const signOut = async (req, res) => {
  const {_id} = res.user;
  if (!_id) {
    throw HttpError(401, "User not authorized");
  }

  await User.findOneAndUpdate(_id, {token: ""});

  res.status(204).join({
    message: "Logout - correct!",
  })
}

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
}