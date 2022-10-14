import express from "express";
//파일을 올릴때 필요한 모듈
import fileupload from "express-fileupload";
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



//html > ejs 변환하긔
app.set("view engine", "ejs");
app.set('views', process.cwd() +"/src/Views/");
app.engine("html", require("ejs").renderFile);

//쿠키 사용하긔
app.use(cookieParser());
//파일 업로드를 해석해준다잉.
app.use(fileupload());
//html body 해석하긔
app.use(express.urlencoded({extended: true}));

//초기 기준 url
app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/board", checkToken, boardRouter);

//server open
app.listen(port, console.log(`${port} open`));
