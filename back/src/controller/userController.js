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
//로그인 체크
export const userLoginCk = async (req, res) => {
    const {MyAccess} = req.cookies;

    const user = await jwt.verify(MyAccess);
    

    const Users = await models.Users.findOne({
            where: {
                UID: user.UID
            },
    });

    res.status(200).json({UID: Users.UID, NickName: Users.NickName}).end();
};

//이메일 중복확인
export const userJoinEmailCk = async (req, res) => {
    const {joinEmail} = req.body;
    
    const Users = await models.Users.findOne({
        where: {Email: joinEmail}

    });

    if(Users){
        res.status(201).json({result: 'no'}).end();    
    }else{
        res.status(201).json({result: 'yes'}).end();
    }
};

//닉네임 중복확인
export const userJoinNickCk = async (req, res) =>{
    const {joinNick} = req.body;
    const Users = await models.Users.findOne({
        where: {NickName: joinNick}
    });

    if(Users){
        res.status(201).json({result: 'no'}).end();
    }else{
        res.status(201).json({result: 'yes'}).end();
    }

};


//로그인
export const userLogin  = async (req, res) => {
    const {loginENName, loginPwdName} = req.body;
    console.log(req.body);

    try {
        const Users = await models.Users.findOne({
            where: {
                //or 연산자 사용
                [Op.or]: [{Email: loginENName}, {NickName: loginENName}]
            }
        });
        
        const {Salt, Pwd, NickName} = Users;
        //hash 단방향 변환
        const hashPassword = addHash(loginPwdName, Salt);

        if(hashPassword === Pwd){
            console.log("로그인 성공");
            const {token} = await jwt.sign(Users);
            
            res.cookie("MyAccess", token, {httpOnly:true});
            res.status(201).json({result: 'ok', UID: Users.UID, NickName}).end();

            // return res.redirect("/");
        }else{
            return res.json({result:"error", reason:"뭔가 틀림1"}).end();
        }

    } catch (error) {
        return res.json({result:"error", reason:"뭔가 틀림2"}).end();
    }
};

//회원 가입
export const userJoin = async (req, res) => {

    const {joinPwdName, joinEmailName, joinNameName, joinNickName, joinYearName, joinMonthName, joinDayName} 
            = req.body;
    console.log(req.body);

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

        return res.json({result:"ok"}).end();
    } catch (error) {
        return res.json({result:"error"}).end();
    }
};

//로그 아웃
export const userLogout = (req, res) => {

    res.clearCookie("MyAccess");
    res.json({result: 'ok'}).end();
};


//유저 정보 보기
export const userSee = async (req, res) => {
    const {id} = req.params;
    const {MyAccess} = req.cookies;
    //토큰 유무 확인(자신인지 아닌지 판별 가능)
    
    const Users = await models.Users.findOne({
        where: {UID: id},
        include: [{
            model: models.Board,
            include: [{
                model: models.Picture,
                require: true
            }]
        },{
            model: models.Users, 
            as: 'Follwings',
            attributes: ["UID"],
        },{
            model: models.Users, 
            as: 'Follwers',
            attributes: ["UID"],
        },
    ]
    });
    //console.log(Users);
    let follwer = false;

    if(!!MyAccess){
        const user = await jwt.verify(MyAccess);

        if(!!user){
            follwer = await models.Follwer.findOne({
                where: {FUID: id, MyUID: user.UID}
            });
        }
    }

    return res.json({Users, isFollwer: !!follwer}).end();
};

//유저 수정 정보 가져오기
export const userEditGet = async (req, res) => {

    const Users = await models.Users.findOne({
        where: {UID: req.UID}
    }); 

    return res.json({Users});
};


// 유저 비밀번호 확인
export const userPwdCkPost = async (req, res) => {
    const { editPCKName } = req.body;

    const Users = await models.Users.findOne({
        where: { UID: req.UID }
    });

    const { Salt, Pwd } = Users;
    const hashPassword = addHash(editPCKName, Salt);

    //변경시 비밀번호 확인
    if (Pwd === hashPassword) {
        return res.json({pwdCk: true}).end();
    } else {
        return res.json({pwdCk: false}).end();
    }

}

//유저 정보 수정
export const userEditPost = async (req, res) => {
    const { editNickName, editPUPName, editYearName, editMonthName, editDayName }
     = JSON.parse(req.body.bodys);

    //비밀번호 변경
    const pwdEditFnc = async () => {
        //비밀번호 변경 입력 여부 확인
        if (editPUPName != "") {
            //비밀번호 변경 원할 시 hash 재설정
            const salt = addSalt();
            const hashPassword = addHash(editPUPName, salt);

            await models.Users.update({
                Salt: salt,
                Pwd: hashPassword
            }, {
                where: { UID: req.UID }
            })
        }
    }
    
    const birthDay = editYearName + "-" + editMonthName + "-" + editDayName;
    try {
        const { file } = req.files; 
        await models.Users.update({
            NickName: editNickName,
            BirthDay: new Date(birthDay),
            ProFile: file.data,
        }, {
            where: { UID: req.UID }
        })
        pwdEditFnc();
    } catch (error) {
        await models.Users.update({
            NickName: editNickName,
            BirthDay: new Date(birthDay),
        }, {
            where: { UID: req.UID }
        })
        pwdEditFnc();
    }
    return res.json({result: true}).end();
};

//유저 삭제
export const userDelete = async (req, res) => {
    await models.Users.destroy({
        where: {UID: req.UID}
    })
    res.clearCookie("MyAccess").end();
};

//팔로우, 언팔로우
export const userFollwer = async (req, res) => {
    const {id} = req.params;

   
    try {
        const follwer = await models.Follwer.findOne({
            where:{
                MyUID: req.UID,
                FUID: parseInt(id)
            }
        });

        if(!!follwer){
            await models.Follwer.destroy({
                where: {
                    MyUID: req.UID,
                    FUID: parseInt(id)
                }
            });

            res.json({result: 'unfollow'}).end();

        }else{
            await models.Follwer.create({
                MyUID: req.UID,
                FUID: parseInt(id)
            });

            res.json({result: 'follow'}).end();
        }
 
    } catch (error) {
       console.log(error); 
    }
};