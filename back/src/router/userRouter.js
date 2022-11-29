import express from "express";
import { userSee, userEditGet, userDelete, userEditPost, userLogout, userFollwer, userPwdCkPost} from "../controller/userController";
import checkToken from "../jwt/check";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", userSee);
//edit get, post
userRouter.post("/:id(\\d+)/pwdck",checkToken, userPwdCkPost);
userRouter.route("/:id(\\d+)/edit").get(checkToken, userEditGet).post(checkToken, userEditPost);
userRouter.post("/:id(\\d+)/logout",checkToken, userLogout);
userRouter.post("/:id(\\d+)/delete",checkToken, userDelete);
userRouter.post("/:id(\\d+)/follwer",checkToken, userFollwer);


export default userRouter;