import express from "express";
import { userSee, userEditGet, userDelete, userEditPost} from "../Controller/userController";

const userRouter = express.Router();

userRouter.get("/1", userSee);
//edit get, post
userRouter.route("/1/edit").get(userEditGet).post(userEditPost);
userRouter.get("/1/delete", userDelete);

export default userRouter;