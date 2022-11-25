import express from "express";
import { boardWritePost, boardSee, boardEditGet, boardEditPost, boardDelte, boardCommt, boardCommtEdit, boardLike } from "../controller/boardController";
import checkToken from "../jwt/check";

const boardRouter = express.Router();

boardRouter.get("/:id(\\d+)", boardSee);
boardRouter.route("/write").post(checkToken, boardWritePost);
boardRouter.route("/:id(\\d+)/edit").get(checkToken ,boardEditGet).post(checkToken, boardEditPost);
boardRouter.post("/:id(\\d+)/delete",checkToken ,boardDelte);
boardRouter.post("/:id(\\d+)/commt",checkToken, boardCommt);
boardRouter.post("/:id(\\d+)/commt/edit",checkToken, boardCommtEdit);

boardRouter.post("/:id(\\d+)/like",checkToken, boardLike);


export default boardRouter;
