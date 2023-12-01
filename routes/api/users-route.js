import express from 'express';

import authController from "../../controllers/users-controller.js";
import { validateBody } from '../../decorators/index.js'; 
import { authenticate, isEmptyBody } from '../../middlewares/index.js';
import { userSignUpSchema, userSignInSchema } from "../../models/User.js";

const usersRoute = express.Router();

usersRoute.post("/register", isEmptyBody, validateBody(userSignUpSchema), authController.signUp);

usersRoute.post("/login", isEmptyBody, validateBody(userSignInSchema), authController.signIn);

usersRoute.get("/current", authenticate, authController.getCurrent);

usersRoute.post("/logout", authenticate, authController.signOut);

usersRoute.patch('/subscription', authenticate, isEmptyBody, validateBody(userUpdateSubscriptionSchema), ctrl.updateSubscription);


export default usersRoute;