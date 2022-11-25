import  express from "express";
import {mainPage, locationPage, getLetter, bestPage} from "../controller/homeController";
import {userLogin, userJoin, userLoginCk, userJoinEmailCk, userJoinNickCk} from "../controller/userController";
import checkToken from "../jwt/check";

const homeRouter = express.Router();

homeRouter.get("/", mainPage);
homeRouter.get("/best", bestPage);
homeRouter.route('/login').get(checkToken, userLoginCk).post(userLogin);
homeRouter.post("/join", userJoin);
homeRouter.post("/getLetter", getLetter);

homeRouter.post("/emailCk", userJoinEmailCk);
homeRouter.post("/nickCk", userJoinNickCk);

homeRouter.get("/location", checkToken, locationPage);

export default homeRouter;