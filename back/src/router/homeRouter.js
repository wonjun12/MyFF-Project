import  express from "express";
import {mainPage, locationPage, getLetter, mainPagging} from "../controller/homeController";
import {userLogin, userJoin} from "../controller/userController";

const homeRouter = express.Router();

homeRouter.get("/", mainPage);
homeRouter.post("/login", userLogin);
homeRouter.post("/join", userJoin);
homeRouter.post("/getLetter", getLetter);
homeRouter.get("/location/:id(\\d+)",locationPage);
homeRouter.get("/mainPagging", mainPagging);


export default homeRouter;