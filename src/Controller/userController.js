import crypto from "crypto";
import { Op } from "sequelize";
import {Users} from "../models";
export const userLogin  = async (req, res) => {
    const {loginENName, loginPwdName} = req.body;

    try {
        const result = await Users.findOne({
            where: {
                [Op.or]: [{Email: loginENName}, {NickName: loginENName}]
            }
        });
        
        const {Salt, Pwd} = result;
        const hashPassword = crypto.createHash("sha512").update(loginPwdName + Salt).digest("hex");

        if(hashPassword === Pwd){
            res.send("비밀번호 일치");
        }else{
            res.send(Salt);
        }
    } catch (error) {
       return res.redirect("/");
    }
};

export const userJoin = async (req, res) => {
    const {joinPwdName, joinYearName, joinMonthName, joinDayName, joinEmailName, joinNameName, joinNickName} 
            = req.body;

    const salt = Math.round((new Date().valueOf() * Math.random())) + "";
    const hashPassword = crypto.createHash("sha512").update(joinPwdName + salt).digest("hex");

    const birthDay = joinYearName + "-" + joinMonthName + "-" + joinDayName;

    await Users.create({
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
export const userSee = (req, res) => {
    res.send("see user");
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
