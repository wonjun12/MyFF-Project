import  express from "express";
import {mainPage, locationPage, getLetter} from "../controller/homeController";
import {userLogin, userJoin} from "../controller/userController";

const homeRouter = express.Router();

homeRouter.get("/", mainPage);
homeRouter.post("/login", userLogin);
homeRouter.post("/join", userJoin);
homeRouter.post("/getLetter", getLetter);
homeRouter.get("/location/:id(\\d+)",locationPage);

export default homeRouter;