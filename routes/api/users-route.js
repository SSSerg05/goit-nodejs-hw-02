import express from 'express';

import usersController from "../../controllers/users-controller.js";
import { validateBody } from '../../decorators/index.js'; 
import { authenticate, isEmptyBody, upload } from '../../middlewares/index.js';
import { userSignUpSchema, userSignInSchema, userUpdateSubscriptionSchema } from "../../models/User.js";

const usersRoute = express.Router();

usersRoute.post("/register", isEmptyBody, validateBody(userSignUpSchema), usersController.signUp);

usersRoute.post("/login", isEmptyBody, validateBody(userSignInSchema), usersController.signIn);

usersRoute.get("/current", authenticate, usersController.getCurrent);

usersRoute.post("/logout", authenticate, usersController.signOut);

usersRoute.patch('/', authenticate, upload.single("avatarURL"), isEmptyBody, validateBody(userUpdateSubscriptionSchema), usersController.update);


export default usersRoute;