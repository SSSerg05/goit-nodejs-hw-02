import express from 'express';

import authController from "../../controllers/auth-controller.js";
import { validateBody } from '../../decorators/index.js'; 
import { isValidId, isEmptyBody } from '../../middlewares/index.js';
import { contactAddSchema, contactFavoriteSchema, contactUpdateSchema } from '../../models/Contact.js';
import { userSignUpSchema } from "../../models/User.js";

const authRoute = express.Router();

authRoute.post("/signup", isEmptyBody, validateBody(userSignUpSchema), authController.signUp);

export default authRoute;