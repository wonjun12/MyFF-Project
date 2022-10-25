import crypto from "crypto";
import { Op } from "sequelize";
import models from "../models";
import jwt from "../jwt/jwt";

//hash 단반향 변환 함수
function addHash(pwd, salt){
    return crypto.createHash("sha512").update(pwd + salt).digest("hex");
}

//랜덤성 부여 함수
function addSalt() {
    return Math.round((new Date().valueOf() * Math.random())) + "";
}

//로그인
export const userLogin  = async (req, res) => {
    const {loginENName, loginPwdName} = req.body;

    try {
        const Users = await models.Users.findOne({
            where: {
                //or 연산자 사용
                [Op.or]: [{Email: loginENName}, {NickName: loginENName}]
            }
        });
        
        const {Salt, Pwd} = Users;
        //hash 단방향 변환
        const hashPassword = addHash(loginPwdName, Salt);

        if(hashPassword === Pwd){
            console.log("로그인 성공");
            const {token} = await jwt.sign(Users);
            
            res.cookie("MyAccess", token, {httpOnly:true, sameSite:"none", secure:true});
            res.status(201).json({result: 'ok', UID: Users.UID});

            // return res.redirect("/");
        }else{
            return res.redirect("/");
        }

    } catch (error) {
        return res.redirect("/");
    }
};

//회원 가입
export const userJoin = async (req, res) => {
    const {joinPwdName, joinYearName, joinMonthName, joinDayName, joinEmailName, joinNameName, joinNickName} 
            = req.body;

    //현재 날짜에 의거하여 랜덤 부여
    const salt = addSalt();
    //hash 단방향 변환 (salt를 추가하여 변환)
    const hashPassword = addHash(joinPwdName, salt);

    const birthDay = joinYearName + "-" + joinMonthName + "-" + joinDayName;

    try {
        await models.Users.create({
            Email: joinEmailName,
            NickName: joinNickName,
            Pwd: hashPassword,
            Salt: salt,
            Name: joinNameName,
            BirthDay: birthDay
        })

        return res.redirect("/");
    } catch (error) {
        return res.redirect("/");
    }
};

//로그 아웃
export const userLogout = (req, res) => {
    res.clearCookie("MyAccess");
    return res.redirect("/");
};


//유저 정보 보기
export const userSee = async (req, res) => {
    const {id} = req.params;
    const {MyAccess} = req.cookies;
    
    const Users = await models.Users.findOne({
        where: {UID: id}
    });
    //토큰 유무 확인(자신인지 아닌지 판별 가능)
    if(MyAccess){
        const user = await jwt.verify(MyAccess);
        req.UID = user.UID;
    }

    return res.render("userTest.html", {Users, reqId: req.UID});
};

//유저 수정 정보 가져오기
export const userEditGet = async (req, res) => {

    const Users = await models.Users.findOne({
        where: {UID: req.UID}
    }); 

    return res.render("userEdit",{Users})
};


//유저 정보 수정
export const userEditPost = async (req, res) => {
    const {editPCKName} = req.body;
    const Users = await models.Users.findOne({
        where: {UID: req.UID}
    });

    const {Salt, Pwd} = Users;
    const hashPassword = addHash(editPCKName, Salt);

    //변경시 비밀번호 확인
    if(Pwd === hashPassword){
        const {editNickName, editPUPName, editYearName, editMonthName ,editDayName}
        = req.body;
        const birthDay = editYearName + "-" + editMonthName + "-" + editDayName;

        await models.Users.update({
            NickName: editNickName,
            BirthDay: birthDay
        },{
            where: {UID: req.UID}
        })

        //비밀번호 변경 입력 여부 확인
        if(editPUPName != ""){
            //비밀번호 변경 원할 시 hash 재설정
            const salt = addSalt();
            const hashPassword = addHash(editPUPName, salt);

            await models.Users.update({
                Salt: salt,
                Pwd: hashPassword
            }, {
                where: {UID: req.UID}
            })
        }
        
        return res.redirect("/");
    }else {
        return res.render("userEdit",{Users})
    }


};

//유저 삭제
export const userDelete = async (req, res) => {
    await models.Users.destroy({
        where: {UID: req.UID}
    })
    res.clearCookie("MyAccess");
    return res.redirect("/");
};
