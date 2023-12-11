import fs from "fs/promises";
import path from "path";
import "dotenv/config";

import HttpError from "../helpers/HttpError";
import User from "../models/User";
import cloudinary from "../helpers/cloudinary.js";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";


const {JWT_SECRET, BASE_URL} = process.env;
const avatarsPath = path.resolve("public", "avatars");

// Реєстрація користувача
//------------------------
export const signUp = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({email});
  if (user) {
    throw HttpError(409, "Email in use");
  }

  // variable for upload + save path for file img avatars
  ////========================
  // const {path: oldPath, filename } = req.file;
  // const newPath = path.join(avatarsPath, filename);
  
  // переміщення файлу з папки ../tmp до ../public/avatars
  // await fs.rename(oldPath, newPath);

  // формування нового відносного шляху до файла
  //  const avatarURL = path.join("avatars", filename);


  ////variable for cloudinary...
  ////========================
  // завантажуємо файл до сховища cloudinary
  ////const fileData = await cloudinary.uploader.upload(
  ////  <шлях_до_файлу_який_хочемо_завантажити>,
  ////  { <назва_папки_куди_завантажуємо_файл>, },
  ////)
  // const { url: avatarURL } = await cloudinary.uploader.upload(
  //   req.file.path, 
  //   { folder: "avatars", }
  // );
  //
  // видалення файлу з папки tmp
  // await fs.unlink(req.file.path); 

  //variable for gravatar... create img-avatar from email user
  ////========================
  const avatarURL = gravatar.url(email, {s:'250',});
 
  // save User (hash password(10 symbols) + add all fields in MongoDB)
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body, 
    password: hashPassword, 
    avatarURL,
    verificationToken: verificationCode,
  });
  
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a 
      target="_blank" 
      href="${BASE_URL}/users/verify/${verificationCode}">
      Click verify email
      </a>`,
  }
  await sendEmail(verifyEmail);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
  })
}