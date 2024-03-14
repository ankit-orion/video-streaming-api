import {Router} from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// here we are creating routes
// register route will direct us to register user method
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }           
    ]),
    registerUser
)

// loegin route will redirect us to loginUser method
router.route("/login").post(loginUser)

// secured routes
// here verifyJWT method or middleware will run 
router.route("/logout").post(verifyJWT, logoutUser)



export default router