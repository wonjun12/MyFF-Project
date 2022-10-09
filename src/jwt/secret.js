module.exports = {
    //원하는 비밀키 설정
    secretKey: "MyFFProJect",
    
    //옵션 (암호 타입, 제한시간, 이름)
    options: {
        algorithm: "HS256",
        expiresIn: "60m",
        issuer: "myff"
    }
}