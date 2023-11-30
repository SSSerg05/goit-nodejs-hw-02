import express from 'express';

import authController from "../../controllers/auth-controller.js";
import { validateBody } from '../../decorators/index.js'; 
import { authenticate, isEmptyBody } from '../../middlewares/index.js';
import { userSignUpSchema, userSignInSchema } from "../../models/User.js";

const authRoute = express.Router();

authRoute.post("/signup", isEmptyBody, validateBody(userSignUpSchema), authController.signUp);

authRoute.post("/signin", isEmptyBody, validateBody(userSignInSchema), authController.signIn);

authRoute.get("/current", authenticate, authController.getCurrent);

export default authRoute;