import express from "express";
//정책 허용
import cors from "cors";
//쿠키 추출
import cookieParser from "cookie-parser";
//DB 모델
import models from "./models";
//파일을 업로드, 다운로드 필요한 모듈
import fileupload from "express-fileupload";
//route 연결
import homeRouter from "./router/homeRouter";
import userRouter from "./router/userRouter";
import boardRouter from "./router/boardRouter";

//token check
import checkToken from "./jwt/check";

//소켓 통신
import socketIO from "./socket/socket";



const app = express();
const PORT = 4000;

// models.sequelize.sync().then(() => {
//     console.log("DB 연결");
// }).catch(err => {
//     console.log(err);
// });


//정책 설정
const corsOptions = { 
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials : true,
};
app.use(cors(corsOptions));

//html body 해석
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//쿠키 사용
app.use(cookieParser());
//파일 업로드를 해석해준다.
app.use(fileupload());


//초기 url
app.use("/api/home", homeRouter);
app.use("/api/user", userRouter);
app.use("/api/board", boardRouter);

const server =  app.listen(PORT, () => {
    console.log(`Server open ${PORT}`);
});

socketIO(server);




