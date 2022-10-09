import jwt from "./jwt";
const tokenFaild = -2, tokenExpiration = -3;

const checkToken = async (req, res, next) => {
    //쿠키에서 MyAccess 가져오기
    const {MyAccess} = req.cookies;
    
    if(!MyAccess){
        console.log("토큰 없음");
        return res.redirect("/");
    }

    //토큰 복호화
    const user = await jwt.verify(MyAccess);

    if(user === tokenExpiration){
        console.log("토큰 만료");
        res.clearCookie("MyAccess");
        return res.redirect("/");
    }else if(user === tokenFaild){
        console.log("토큰 부적합");
        return res.redirect("/");
    }

    //토큰 재설정
    const {token} = await jwt.sign(user);
    res.cookie("MyAccess", token , {httpOnly:true});
    //서버에 접속중인 UID 전송
    req.UID = user.UID;
    //다음
    next();
}

export default checkToken;