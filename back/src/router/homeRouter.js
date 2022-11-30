import  express from "express";
import {mainPage, locationPage, getLetter, bestPage, bestUserPage, pwdMail, mainSearch, tagPage} from "../controller/homeController";
import {userLogin, userJoin, userLoginCk, userJoinEmailCk, userJoinNickCk, pwdChange} from "../controller/userController";
import checkToken from "../jwt/check";

const homeRouter = express.Router();

homeRouter.get("/", checkToken, mainPage);

homeRouter.get("/best", bestPage);
homeRouter.get("/bestuser", bestUserPage);
homeRouter.get('/tag', tagPage)

homeRouter.post('/pwdMail', pwdMail);
homeRouter.post('/pwdChange', pwdChange)

homeRouter.route('/login').get(checkToken, userLoginCk).post(userLogin);
homeRouter.post("/join", userJoin);

homeRouter.post("/getLetter", getLetter);

homeRouter.post("/emailCk", userJoinEmailCk);
homeRouter.post("/nickCk", userJoinNickCk);

homeRouter.post('/search', mainSearch);

homeRouter.get("/location", checkToken, locationPage);

export default homeRouter;