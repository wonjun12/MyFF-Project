import  express from "express";
import {mainPage, locationPage, getLetter, makerImg} from "../Controller/homeController";
import {userLogin, userJoin} from "../Controller/userController";

import checkToken from "../jwt/check";

const homeRouter = express.Router();

homeRouter.get("/", mainPage);
homeRouter.post("/login", userLogin);
homeRouter.post("/join", userJoin);
homeRouter.post("/getLetter", getLetter);
homeRouter.get("/location/:id(\\d+)",checkToken, locationPage);
homeRouter.get("/getMaker", makerImg);



export default homeRouter;