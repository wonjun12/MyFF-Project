//node express 사용
import express from "express";
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

//소켓 통신
import socketIO from "./socket/socket";

//경로 설정
import path from 'path';




const app = express();
const PORT = 4000;

//DB 연결 및 table 생성
models.sequelize.sync().then(() => {
    console.log("DB 연결");
}).catch(err => {
    console.log(err);
});


//정책 설정
import cors from 'cors';
const corsOptions = { 
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials : true,
};
app.use(cors(corsOptions));

//기본 경로 설정
// app.use(express.static(path.join(__dirname, "../../front/build")));

//html body 해석
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//쿠키 사용
app.use(cookieParser());
//파일 업로드를 해석해준다.
app.use(fileupload());


//초기 url 설정
app.use("/api/home", homeRouter);
app.use("/api/user", userRouter);
app.use("/api/board", boardRouter);

//front로 보여줄 경로에 index경로 설정
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../../front/build", "index.html"));
// });

//오픈한 서버 정보 받기
const server =  app.listen(PORT, () => {
                //서버 오픈
    console.log(`Server open ${PORT}`);
});

//소켓과 연결
socketIO(server);




