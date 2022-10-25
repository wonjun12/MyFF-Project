import randToken from "rand-token";
import jwt from "jsonwebtoken";
import {secretKey, options} from "./secret";
const tokenFaild = -2, tokenExpiration = -3;

module.exports = {
    //모듈 객체를 만들어서 user 테이블을 넣는다.
    sign: async (user) => {
        //payload 설정
        const payload = {
            UID: user.UID,
            Email: user.Email,
            NickName: user.NickName
        };
        //값 설정 후 return
        const result = {
            token: jwt.sign(payload, secretKey, options),
            refreshToken: randToken.uid(256)
        };
        return result;
    },

    verify: async (token) => {
        //토큰 복호화
        let decoded
        try {
            decoded = jwt.verify(token, secretKey);    
        } catch (error) {
            if(error.message === "jwt expired"){
                console.log("토큰 만료");
                return tokenExpiration;
            }else{
                console.log("토큰 부적합");
                return tokenFaild;
            } 
        }
        return decoded;
    }

}