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
// import cors from 'cors';
// const corsOptions = { 
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials : true,
// };
// app.use(cors(corsOptions));

//기본 경로 설정
app.use(express.static(path.join(__dirname, "../../front/build")));

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
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../front/build", "index.html"));
});

//오픈한 서버 정보 받기
const server =  app.listen(PORT, () => {
                //서버 오픈
    console.log(`Server open ${PORT}`);
});

models.Users.findOne({
    where: {
        UID: 3
    },
    attributes: ['UID', 'Email', 'NickName'],
    //연결된 외래키 검색
    include: [{
        //해당 유저의 MyUID를 기준으로 fowller테이블 검색
        model:models.Users,
        as: 'Follwers',
        attributes: ['UID', 'Email', 'NickName', 'Profile'],
        include: [{
            //검색된 팔로우에서 FUID에 맞는 게시물들 검색
            model: models.Board,
            include: [{
                model: models.Users,
                required: true,
                attributes: ['UID', 'Email', 'NickName', 'Profile']
            },{
                model: models.Picture,
                required: true,
                limit: 1
            },{
                model: models.BoardLike,
            },{
                model: models.Hashtag,
            },{
                model: models.Comment,
                attributes: ['CID']
                // attributes: ['CID', [models.sequelize.fn('COUNT', models.sequelize.col('Boards.comments.CID')), 'counts']]
            }]
        }]
    }, {
        //접속한 유저의 게시물 검색
        model: models.Board,
        attributes: ['BID', 'UID', 'Location', 'PlaceName', 'Content', 'Star', 'Views', 'createdAt'],
        include: [{
            model: models.Users,
            require: true,
            attributes: ['UID', 'Email', 'NickName', 'Profile']
        },{
            model: models.Picture,
            required: true,
            limit: 1
        },{
            model: models.BoardLike,
        },{
            model: models.Hashtag,
        },{
            model: models.Comment,
            attributes: ['CID']
            // attributes: ['CID', [models.sequelize.fn('COUNT', models.sequelize.col('Boards.comments.CID')), 'counts']]
        }]
    }], 
    order: [[models.Board, 'BID', 'DESC']]
}).then(board => {
    console.log(board.Boards[0]);
    console.log(board.Boards[0].BID);
    console.log(board.Boards[1].BID);
    console.log(board.Boards[2].BID);
    console.log(board.Follwers[0].Boards[0].BID)
})





//소켓과 연결
socketIO(server);




