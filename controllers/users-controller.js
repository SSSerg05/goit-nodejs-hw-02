import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

import User from "../models/User.js";
import HttpError from '../helpers/HttpError.js';
import { ctrlWrapper } from '../decorators/index.js';


const {JWT_SECRET} = process.env;
const avatarsPath = path.resolve("public", "avatars");

// Реєстрація користувача
//------------------------
const signUp = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({email});
  if (user) {
    throw HttpError(409, "Email in use");
  }

  // upload + save path for file img avatars
  const {path: oldPath, filename } = req.file;
  const newPath = path.join(postersPath, filename);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("public", "avatars", filename);

  // save User
  const hashPassword = await bcrypt.hash(password, 10)
  const newUser = await User.create({
    ...req.body, 
    password: hashPassword, 
    avatarURL,
  });
  
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
  await User.findByIdAndUpdate(user._id, {token});

  res.json({
    token,
  })
}


// отримання даних про поточного користувача
//------------------------
const getCurrent =  async (req, res) => {
  const {_id, username, email, subscription, token} = req.user;
  if (!_id) {
    throw HttpError(401, "User not authorized");
  }
  res.status(200).json({
    email,
    subscription,
  })
}

// вихід з облікового запису
//------------------------
const signOut = async (req, res) => {
  const {_id} = req.user;
  if (!_id) {
    throw HttpError(401, "User not authorized");
  }

  await User.findOneAndUpdate(_id, {token: null});

  res.status(204)
}

const update = async (req, res) => {
  const {_id} = req.user;
  if (!_id) {
    throw HttpError(401, "User not authorized");
  }

  const result = await User.findByIdAndUpdate(_id, req.body);
  if (!result) {
    throw HttpError(404, `Not found user with id:${_id}`);
  }

  res.json(result);
}

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  update: ctrlWrapper(update),
}