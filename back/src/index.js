import express from "express";
//정책 허용
import cors from "cors";
//쿠키 추출
import cookieParser from "cookie-parser";
//DB 모델
import models from "./models";
import { Op } from "sequelize";


const app = express();
const PORT = 4000;

models.sequelize.sync().then(() => {
    console.log("DB 연결");
}).catch(err => {
    console.log(err);
});


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


import crypto from "crypto";

//hash 단반향 변환 함수
function addHash(pwd, salt){
    return crypto.createHash("sha512").update(pwd + salt).digest("hex");
}

//랜덤성 부여 함수
function addSalt() {
    return Math.round((new Date().valueOf() * Math.random())) + "";
}
const boardRouter = express.Router();
// app.get("/", () => {}
// );
boardRouter.post("/", async (req, res) => {
    const {id, pwd} = req.body;


    try {
        const Users = await models.Users.findOne({
            where: {NickName: id}
        });
        
        const {Salt, Pwd} = Users;
        //hash 단방향 변환
        const hashPassword = addHash(pwd, Salt);

        if(hashPassword === Pwd){
            console.log("로그인 성공");

            res.status(201).json({result: 'ok', UID: Users}).end();

            // return res.redirect("/");
        }else{
            console.log("로그인 실패");
            res.json({result:"faild"}).end();
        }

    } catch (error) {
        console.log(error);
        res.json();
    }
    
});
app.use("/",boardRouter);


app.listen(PORT, () => {
    console.log(`Server open ${PORT}`);
})





