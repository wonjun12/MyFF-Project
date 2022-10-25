import express from "express";
import { userSee, userEditGet, userDelete, userEditPost, userLogout} from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", userSee);
//edit get, post
userRouter.route("/:id(\\d+)/edit").get(userEditGet).post(userEditPost);
userRouter.post("/:id(\\d+)/logout", userLogout);
userRouter.post("/:id(\\d+)/delete",userDelete);

export default userRouter;