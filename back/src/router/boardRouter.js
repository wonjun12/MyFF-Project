import express from "express";
import { boardWriteGet, boardWritePost, boardSee, boardEditGet, boardEditPost, boardDelte, boardCommt, boardCommtEdit } from "../controller/boardController";

const boardRouter = express.Router();

boardRouter.get("/:id(\\d+)", boardSee);
boardRouter.route("/write").get(boardWriteGet).post(boardWritePost);
boardRouter.route("/:id(\\d+)/edit").get(boardEditGet).post(boardEditPost);
boardRouter.post("/:id(\\d+)/delete", boardDelte);
boardRouter.post("/:id(\\d+)/commt", boardCommt);
boardRouter.post("/:id(\\d+)/commt/edit", boardCommtEdit);


export default boardRouter;
