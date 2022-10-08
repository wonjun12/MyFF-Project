import express from "express";
import { boardWriteGet, boardWritePost, boardSee, boardEditGet, boardEditPost, boardDelte, boardCommt, boardCommtEdit } from "../Controller/boardController";

const boardRouter = express.Router();

boardRouter.route("/write").get(boardWriteGet).post(boardWritePost);
boardRouter.get("/1", boardSee);
boardRouter.route("/1/edit").get(boardEditGet).post(boardEditPost);
boardRouter.post("/1/delete", boardDelte);
boardRouter.post("/1/commt", boardCommt);
boardRouter.post("/1/commt/edit", boardCommtEdit);


export default boardRouter;
