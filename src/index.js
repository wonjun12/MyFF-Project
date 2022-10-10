import express from "express";
//쿠키 추출
import cookieParser from "cookie-parser";
//db model 생성 및 연결
import models from "./models/index.js";
//route 연결
import homeRouter from "./Router/homeRouter";
import userRouter from "./Router/userRouter";
import boardRouter from "./Router/boardRouter";
//token check
import checkToken from "./jwt/check";

const app = express();
const port = 3000;

//db 생성 및 연결
models.sequelize.sync().then(() => {
    console.log("성공");
}).catch(error => {
    console.log(error);
});



//html > ejs 변환
app.set("view engine", "ejs");
app.set('views', process.cwd() +"/src/Views/");
app.engine("html", require("ejs").renderFile);

//쿠키 사용
app.use(cookieParser());
//html body 해석
app.use(express.urlencoded({extended: true}));

//초기 기준 url
app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/board", checkToken, boardRouter);

//server open
app.listen(port, console.log(`${port} open`));
