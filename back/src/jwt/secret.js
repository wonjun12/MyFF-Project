module.exports = {
    //원하는 비밀키 설정 (암, 복호화시 필요함)
    secretKey: "MyFFProJect0705SNSPictuRe!3%t#t&y1Q23E4",
    
    //옵션 (암호 타입, 제한시간, 이름)
    options: {
        algorithm: "HS256",
        expiresIn: "60m",
        issuer: "myff"
    }
}
//최종시 gitignore 추가