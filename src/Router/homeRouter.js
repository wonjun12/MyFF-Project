import  express from "express";
import {mainPage, locationPage} from "../Controller/homeController";
import {userLogin, userJoin} from "../Controller/userController";

import checkToken from "../jwt/check";

const homeRouter = express.Router();

homeRouter.get("/", mainPage);
homeRouter.post("/login", userLogin);
homeRouter.post("/join", userJoin);
homeRouter.get("/location/1",checkToken, locationPage);



export default homeRouter;