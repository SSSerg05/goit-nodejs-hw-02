import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/User.js";

const { JWT_SECRET} = process.env;

const authenticate = async (req, res, next) => {
  const {authorization} = req.headers;
  if (!authorization) {
    throw HttpError(401, 'Authorization header not found.');
  }

  const {bearer, token} = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpError(401, 'Token not valid');
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id)
    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, 'user not found');
    }

    // зберігаємо дані про користувача, який пройшов перевірку, для 
    // коректного відображення даних цього користувача у базі (колекції) Контакти 
    req.user = user;
    
    next();

  } catch (error) {
    throw HttpError(401, error.message);
  }
}

export default ctrlWrapper(authenticate);