import express from 'express';

import usersController from "../../controllers/users-controller.js";
import { validateBody } from '../../decorators/index.js'; 
import { authenticate, isEmptyBody, upload } from '../../middlewares/index.js';
import { userSignUpSchema, userSignInSchema, userUpdateSubscriptionSchema, userUpdateAvatarSchema, userEmailSchema } from "../../models/User.js";

const usersRoute = express.Router();

usersRoute.post("/register", upload.single("avatarURL"), isEmptyBody, validateBody(userSignUpSchema), usersController.signUp);

usersRoute.get("/verify/:verificationToken", usersController.verify);

usersRoute.post("/verify:", isEmptyBody, validateBody(userEmailSchema), usersController.resendVerify);

usersRoute.post("/login", isEmptyBody, validateBody(userSignInSchema), usersController.signIn);

usersRoute.get("/current", authenticate, usersController.getCurrent);

usersRoute.post("/logout", authenticate, usersController.signOut);

usersRoute.patch('/', authenticate, isEmptyBody, validateBody(userUpdateSubscriptionSchema), usersController.update);

usersRoute.patch('/avatars', authenticate, upload.single("avatarURL"), validateBody(userUpdateAvatarSchema), usersController.updateAvatar);

export default usersRoute;