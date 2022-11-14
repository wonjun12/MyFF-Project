import  express from "express";
import {mainPage, locationPage, getLetter} from "../controller/homeController";
import {userLogin, userJoin, userLoginCk, userJoinEmailCk, userJoinNickCk} from "../controller/userController";
import checkToken from "../jwt/check";

const homeRouter = express.Router();

homeRouter.get("/", mainPage);
homeRouter.route('/login').get(checkToken, userLoginCk).post(userLogin);
homeRouter.post("/join", userJoin);
homeRouter.post("/getLetter", getLetter);
homeRouter.get("/location/:id(\\d+)",locationPage);

homeRouter.post("/emailCk", userJoinEmailCk);
homeRouter.post("/nickCk", userJoinNickCk);

export default homeRouter;