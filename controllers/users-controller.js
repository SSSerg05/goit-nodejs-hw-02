import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
//import cloudinary from "../helpers/cloudinary.js";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import "dotenv/config";

import User from "../models/User.js";
import HttpError from '../helpers/HttpError.js';
import sendEmail from "../helpers/sendEmail.js";
import verifyEmail from "../helpers/verifyEmail.js";
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

  //variable for gravatar... create img-avatar from email user
  ////========================
  const avatarURL = gravatar.url(email, {s:'250',});
 
  // save User (hash password(10 symbols) + add all fields in MongoDB)
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body, 
    password: hashPassword, 
    avatarURL,
    verificationToken,
  });
  
  await sendEmail(verifyEmail({email, verificationToken}))

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
  })
}

// підтвердження що користувач підтвердив верефікацію з надіслоного йому листа
//------------------------
const verify = async (req, res) => {
  const {verificationToken} = req.params;
  
  const user = await User.findOne({verificationToken}); 
  if (!user) {
    throw HttpError(401,'User not found or not verify');
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

  res.json({
    message: "Email verify success"
  })
}

// повторне відправлення листа веріфікації
//------------------------
const resendVerify = async (req, res) => {

  const {email} = req.body;
  if(!email) {
    throw HttpError(400, "missing required field email")
  }

  const user = await User.findOne({email});
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  const {verify, verificationToken} = user;
  if (verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  await sendEmail(verifyEmail({email, verificationToken}));
  res.json({
    message: `${email} - email resend success`,
    email: email,
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

  const {verify} = user;
  if (!verify) {
    throw HttpError(401,'User not verify');
  }
  
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password wrong");
  }

  const payload = {
    id: user.id,
  }
  if (!user.verify) {
    throw HttpError(404, "User not found or not verithication");
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
  const {_id, email, subscription} = req.user;
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

  res.status(204);
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


const updateAvatar = async (req, res) => {

  const {_id, avatarURL} = req.user;
  if (!_id) {
    throw HttpError(401, "User not authorized");
  }

  // видаляємо стару картинку аватара (якщо це можливо)
  const deletedFile = path.basename(avatarURL);
  const deletedPath = path.join(avatarsPath, deletedFile);
  try {
    await fs.unlink(deletedPath); 
  } catch (error) {
    console.log(`${error} Cannot find deleted file ${deletedPath}`);
  }

  // картинка аватару у папці ../tmp
  const {path: oldPath, filename } = req.file;
  try {
    // визначаємо новий повний шлях до файлу ../public/avatars
    const newPath = path.join(avatarsPath, filename);

    // зміна якості+розміру картинки
    Jimp.read(oldPath, async (err, img) => {
      await img.resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .writeAsync(newPath); // save файл з папки ../tmp до ../public/avatars
    });

    // переміщення файлу з папки ../tmp до ../public/avatars
    //await fs.rename(oldPath, newPath);
        
    // формування нового відносного шляху до файла
    const avatarImage = path.join("avatars", filename);

    // оновлення даних
    const result = await User.findByIdAndUpdate(_id, {avatarURL: avatarImage});
    if (!result) {
      throw HttpError(404, `Not found user with id:${_id}`);
    }
  
    await fs.unlink(oldPath);
    res.status(200).json(
      avatarImage,
    );
  } catch (error) {
      await fs.unlink(oldPath);
      throw HttpError(404, `Cannot add avatar file in folder`);
  }
  
}


export default {
  signUp: ctrlWrapper(signUp),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  update: ctrlWrapper(update),
  updateAvatar: ctrlWrapper(updateAvatar),
}