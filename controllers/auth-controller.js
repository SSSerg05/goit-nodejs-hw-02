import bcrypt from "bcryptjs";

import User from "../models/User.js";

import HttpError from '../helpers/HttpError.js';
import { ctrlWrapper } from '../decorators/index.js';


const signUp = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({email});
  if (user) {
    throw HttpError(409, "Email already exist")
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const newUser = await User.create({...req.body, password: hashPassword});
  
  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  })
}

const signIn = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    throw HttpError(401, "Email or password invalide");
  }
  
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalide");
  }

  const token = "1111111";
  res.json({
    token,
  })

}

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
}