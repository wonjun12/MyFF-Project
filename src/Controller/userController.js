import crypto from "crypto";
import { Op } from "sequelize";
import {Users} from "../models";
export const userLogin  = async (req, res) => {
    const id = req.body.loginENName;
    const password = req.body.loginPwdName;
    try {
        const result = await Users.findOne({
            where: {
                [Op.or]: [{Email: id}, {NickName: id}]
            }
        });
        const {Salt, Pwd} = result;
        const hashPassword = crypto.createHash("sha512").update(password + Salt).digest("hex");

        if(hashPassword === Pwd){
            res.send("비밀번호 일치");
        }else{
            res.send(Salt);
        }
    } catch (error) {
        console.log("오류");
    }

    


};

export const userJoin = async (req, res) => {
    const body = req.body;

    const password = body.joinPwdName;
    const salt = Math.round((new Date().valueOf() * Math.random())) + "";
    const hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");

    const birthDay = body.joinYearName + "-" + body.joinMonthName + "-" + body.joinDayName;

    await Users.create({
        Email: body.joinEmailName,
        Pwd: hashPassword,
        Salt: salt,
        Name: body.joinNameName,
        NickName: body.joinNickName,
        BirthDay: birthDay
    }).then(result => {
        console.log("암호화 회원가입 완료");
        res.redirect("/");
    }).catch(error => {
        console.log(error);
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