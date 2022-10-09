import express from "express";
import { userSee, userEditGet, userDelete, userEditPost, userLogout} from "../Controller/userController";
import checkToken from "../jwt/check";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", userSee);
//edit get, post
userRouter.route("/1/edit").get(checkToken, userEditGet).post(checkToken, userEditPost);
userRouter.post("/1/logout",checkToken, userLogout);
userRouter.post("/1/delete",checkToken, userDelete);

export default userRouter;