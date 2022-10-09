import crypto from "crypto";
import { Op } from "sequelize";
import models from "../models";
import jwt from "../jwt/jwt";

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
        const hashPassword = crypto.createHash("sha512").update(loginPwdName + Salt).digest("hex");

        if(hashPassword === Pwd){
            console.log("로그인 성공");

            const {token} = await jwt.sign(Users);
            res.cookie("MyAccess", token, {httpOnly:true});

            return res.render("home.html", {UID: Users.UID});
        }else{
            res.send(Salt);
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
    const salt = Math.round((new Date().valueOf() * Math.random())) + "";
    //hash 단방향 변환 (salt를 추가하여 변환)
    const hashPassword = crypto.createHash("sha512").update(joinPwdName + salt).digest("hex");

    const birthDay = joinYearName + "-" + joinMonthName + "-" + joinDayName;

    await models.Users.create({
        Email: joinEmailName,
        Pwd: hashPassword,
        Salt: salt,
        Name: joinNameName,
        NickName: joinNickName,
        BirthDay: birthDay
    }).then(() => {
        console.log("암호화 회원가입 완료");
        return res.redirect("/");
    }).catch(error => {
        return res.redirect("/");
    })

};

export const userLogout = (req, res) => {
    res.clearCookie("MyAccess");
    return res.redirect("/");
};

export const userSee = async (req, res) => {
    const {id} = req.params;
    const {MyAccess} = req.cookies;
    
    const Users = await models.Users.findOne({
        where: {UID: id}
    });
    
    if(MyAccess){
        const user = await jwt.verify(MyAccess);
        req.UID = user.UID;
    }

    return res.render("userTest.html", {Users, reqId: req.UID});
};
export const userEditGet = (req, res) => {
    res.send("edit user");
};
export const userEditPost = (req, res) => {
    res.send("edit user post");
};
export const userDelete = (req, res) => {
    res.send("delete user");
};
